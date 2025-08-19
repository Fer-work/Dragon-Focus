// server/utils/authMiddleware.js

import admin from "firebase-admin";
import User from "../models/User.js";

const protect = async (req, res, next) => {
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
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }

  try {
    // 1. Verify the token. This is the authentication step.
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Attach the verified Firebase user info to the request.
    // This is useful for the createUser controller.
    req.firebaseUser = decodedToken;

    // 3. Try to find the user in your local database.
    const appUser = await User.findOne({
      firebaseUid: decodedToken.uid,
    });

    // 4. If the user exists in your DB, attach the full user document.
    // This is what all your other controllers will use.
    if (appUser) {
      req.user = appUser;
    }

    // 5. Always proceed to the next step (the controller).
    // The controller will now decide if a DB user is required for that specific action.
    next();
  } catch (error) {
    // Your existing error handling for invalid/expired tokens is perfect and remains here.
    console.error("Error verifying auth token:", error);
    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ message: "Not authorized, token expired." });
    }
    return res.status(401).json({ message: "Not authorized, token invalid." });
  }
};

export { protect };
