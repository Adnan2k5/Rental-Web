import { addItemToCart, getCart } from "../controllers/cart.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/", verifyJWT, addItemToCart);

export default router;