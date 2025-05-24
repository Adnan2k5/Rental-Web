import { Router } from "express";
import { 
    createTicket,
    getUserTickets,
    getTicketById,
    addTicketResponse,
    updateTicketStatus,
    getAllTickets
} from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Apply JWT verification to all routes
// router.use(verifyJWT);

// User routes
router.post("/create", upload.array("attachments", 5), createTicket);
router.get("/my-tickets", getUserTickets);
router.get("/:ticketId", verifyJWT, getTicketById);
router.post("/:ticketId/respond", verifyJWT,addTicketResponse);
router.patch("/:ticketId/status", verifyJWT,updateTicketStatus);

// Admin routes
router.get("/", getAllTickets);

export default router;