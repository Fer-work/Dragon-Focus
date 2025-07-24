import User from "../models/User.js"; // Path to your User model
import admin from "firebase-admin";

// @desc    Create a new user profile or get existing if already created
// @route   POST /api/users
// @access  Private (typically called after Firebase auth, token should be verified by middleware)
//          Or, if this is the very first step to link Firebase to your DB,
//          it might be called with a verified token from the client, and this controller
//          would use admin.auth().verifyIdToken() if authMiddleware isn't applied to this specific route.
//          For simplicity, assuming authMiddleware (protect) is applied and req.user is populated.
export async function createUser(req, res) {
  try {
    let { email, username } = req.body; // Get email and optional username from request body
    let firebaseUid;
    let tokenVerifiedByThisFunction = false;

    if (req.user && req.user.firebaseUid) {
      // If protect middleware already ran and populated req.user
      firebaseUid = req.user.firebaseUid;
      // If email from token (via protect middleware) differs from body, prioritize token's email
      const emailFromToken = req.user.email; // Assuming protect middleware adds email from decoded token or DB
      if (emailFromToken && emailFromToken !== email) {
        console.warn(
          `Email in request body ('${email}') differs from token/DB email ('${emailFromToken}'). Using token/DB email.`
        );
        email = emailFromToken;
      }
    } else {
      // If protect middleware did NOT run for this route, verify token here
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.headers.authtoken) {
        token = req.headers.authtoken;
      }

      if (!token) {
        return res.status(401).json({
          message: "Not authorized, no token provided for user creation/sync.",
        });
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      firebaseUid = decodedToken.uid;
      // The email from the decoded token is the most trustworthy source
      email = decodedToken.email; // Overwrite email from body with token's email
      tokenVerifiedByThisFunction = true;
    }

    if (!firebaseUid) {
      // Should be caught by token checks, but as a safeguard
      return res
        .status(400)
        .json({ message: "Firebase UID could not be determined." });
    }
    // The email from the request body will be used if not overwritten by token.
    // Ensure email is present if your schema requires it.
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if user already exists with this Firebase UID
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // User already exists. Optionally update fields.
      // For example, if username is provided and different, or email from token is different.
      let updated = false;
      if (username && user.username !== username) {
        user.username = username;
        updated = true;
      }
      // If the email in the DB is different from the one now associated with the firebaseUid (e.g., from token)
      if (email && user.email !== email) {
        user.email = email; // Be cautious with email updates; ensure it's verified
        updated = true;
      }
      if (updated) {
        await user.save();
        return res.status(200).json({ message: "User profile updated.", user });
      }
      return res.status(200).json({ message: "User already exists.", user });
    }

    // If user does not exist, create a new one
    user = new User({
      firebaseUid,
      email, // Use the email (either from body or potentially from token if you uncomment that logic)
      username,
      focusGems: 0,
      preferences: {
        defaultPomodoroTime: 25,
        defaultShortBreakTime: 5,
        defaultLongBreakTime: 15,
        theme: "default",
      },
    });

    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    // delete userResponse.__v;

    res.status(201).json({
      message: "User profile created successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    // Handle duplicate key error for email or username if they have unique constraints
    if (error.code === 11000) {
      // Determine which field caused the duplicate error
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(409)
        .json({ message: `An account with that ${field} already exists.` });
    }
    res
      .status(500)
      .json({ message: "Failed to create user profile on the server." });
  }
}

// @desc    Get current authenticated user's profile
// @route   GET /api/users/me
// @access  Private (requires authentication via protect middleware)
export async function getCurrentUser(req, res) {
  try {
    console.log(
      "[getCurrentUser] Entered. req.user is:",
      req.user ? req.user._id.toString() : "undefined"
    ); // LOG 5
    const user = req.user;
    if (!user) {
      console.log("[getCurrentUser] req.user is undefined here. Sending 404."); // LOG 6
      return res.status(404).json({ message: "User not found." });
    }
    // req.user is populated by the 'protect' middleware and contains the full User document
    // from your MongoDB, fetched using the firebaseUid from the token.

    if (!user) {
      // This case should ideally be caught by the protect middleware if appUser isn't found
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user object (Mongoose document by default includes __v, toObject() can be used)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
}

// @desc    Update current authenticated user's profile
// @route   PUT /api/users/me
// @access  Private (requires authentication via protect middleware)
export async function updateCurrentUser(req, res) {
  try {
    const userId = req.user._id;
    // Key Change: We get the whole body, not a nested 'preferences' object.
    const updates = req.body;
    console.log("Updates: ", updates);

    // Find the user by their MongoDB _id
    let user = await User.findById(userId);

    if (!user) {
      // Should not happen if protect middleware is working correctly
      return res.status(404).json({ message: "User not found." });
    }

    // Update username if it was sent
    if (updates.username !== undefined) {
      user.username = updates.username;
    }

    // --- Start of Fix ---
    // Explicitly map incoming preference keys to the schema's field names
    const preferencesToUpdate = {};
    if (updates.pomodoroDuration !== undefined) {
      preferencesToUpdate.defaultPomodoroTime = updates.pomodoroDuration;
    }
    if (updates.shortBreakDuration !== undefined) {
      preferencesToUpdate.defaultShortBreakTime = updates.shortBreakDuration;
    }
    if (updates.longBreakDuration !== undefined) {
      preferencesToUpdate.defaultLongBreakTime = updates.longBreakDuration;
    }
    if (updates.longBreakInterval !== undefined) {
      preferencesToUpdate.defaultLongBreakInterval = updates.longBreakInterval;
    }

    // Merge the correctly mapped preferences into the user's existing preferences
    user.preferences = {
      ...user.preferences.toObject(),
      ...preferencesToUpdate,
    };
    // --- End of Fix ---

    // Add other updatable fields as needed, e.g., focusGems (though that might be updated by other actions)
    const updatedUser = await user.save();
    console.log(`updatedUser: `, updatedUser);

    res.status(200).json({
      message: "User profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res
        .status(409)
        .json({ message: "This username is already taken." });
    }
    res.status(500).json({ message: "Failed to update user profile." });
  }
}

// Optional: If you need an admin function to get user by Firebase UID (ensure it's protected by an admin role check)
// export async function getUserByFirebaseUid(req, res) { ... }

// Optional: Delete user account
// export async function deleteCurrentUser(req, res) { ... }
