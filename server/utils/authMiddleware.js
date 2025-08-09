// server/utils/authMiddleware.js

import admin from "firebase-admin";
import User from "../models/User.js"; // Path to your User model

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token) or custom 'authtoken' header
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
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(
      "[Protect Middleware] Token Decoded. Firebase UID:",
      decodedToken.uid
    ); // LOG 1

    const appUser = await User.findOne({
      firebaseUid: decodedToken.uid,
    }).select("-__v");
    console.log(
      "[Protect Middleware] User found in DB for UID " + decodedToken.uid + ":",
      appUser ? appUser._id.toString() : "null"
    ); // LOG 2

    if (!appUser) {
      console.log(
        '[Protect Middleware] appUser is null. Sending 401 "User not found in application database."'
      ); // LOG 3
      return res
        .status(401)
        .json({ message: "User not found in application database." });
    }

    req.user = appUser;
    console.log(
      "[Protect Middleware] req.user set. User MongoDB ID:",
      req.user._id.toString(),
      "Calling next()."
    ); // LOG 4
    next();
  } catch (error) {
    console.error(
      "[Protect Middleware] Error verifying auth token OR finding user:",
      error
    ); // LOG ERROR
    console.error("Error verifying auth token:", error);
    // Handle different Firebase auth errors specifically if needed
    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ message: "Not authorized, token expired." });
    }
    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/id-token-revoked"
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized, token invalid." });
    }
    return res
      .status(401)
      .json({ message: "Not authorized, token verification failed." });
  }
};

// Optional: Middleware to restrict access to certain roles (if you implement roles)
// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: `User role ${req.user ? req.user.role : ''} is not authorized to access this route` });
//     }
//     next();
//   };
// };

export { protect /*, authorize */ };
