import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    const user = req.user;
    if (!user.isAdmin) {
        throw new ApiError(403, "Unauthorized request");
    }
    next();
});