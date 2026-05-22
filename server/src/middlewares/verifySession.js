import { getDB } from "../config/db.js";
import ApiError from "../utils/ApiError.js";


const extractSessionToken = (bearerToken) => {
  const dotIndex = bearerToken.indexOf(".");
  return dotIndex === -1 ? bearerToken : bearerToken.slice(0, dotIndex);
};

export const makeVerifySession = () => async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Unauthorized — no active session"));
    }

    const bearerToken = authHeader.split(" ")[1];
    if (!bearerToken) {
      return next(new ApiError(401, "Unauthorized — missing token"));
    }

    const token = extractSessionToken(bearerToken);
    const db = getDB();

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return next(new ApiError(401, "Unauthorized — session not found"));
    }

    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      return next(new ApiError(401, "Unauthorized — session expired"));
    }

    const user = await db
      .collection("users")
      .findOne(
        { _id: session.userId },
        { projection: { _id: 1, name: 1, email: 1, image: 1 } },
      );
    if (!user) {
      return next(new ApiError(401, "Unauthorized — user not found"));
    }

    req.user = {
      id: user._id?.toString() || "",
      email: user.email || "",
      name: user.name || "User",
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized — verification failed"));
  }
};
