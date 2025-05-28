import { Router } from "express";
import { 
    createTicket,
    getUserTickets,
    getTicketById,
    addTicketResponse,
    updateTicketStatus,
    getAllTickets
} from "../controllers/ticket.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            // No token provided, continue without setting req.user
            return next();
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -reviews").populate("paymentDetails");    
        
        if (user) {
            req.user = user;
        }
        
        next();
    } catch (error) {
        // If token is invalid, continue without setting req.user
        // This allows unauthenticated users to still create tickets
        next();
    }
})

const requireAuth = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        throw new ApiError(401, "Access token is required");
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -reviews").populate("paymentDetails");
        
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})


const router = Router();
router.post("/create", verifyJWT, upload.array("attachments", 5), createTicket);
router.get("/my-tickets", requireAuth, getUserTickets);
router.get("/:ticketId", requireAuth, getTicketById);
router.post("/:ticketId/respond", requireAuth, addTicketResponse);
router.patch("/:ticketId/status", requireAuth, updateTicketStatus);

// Admin routes
router.get("/", getAllTickets);

export default router;