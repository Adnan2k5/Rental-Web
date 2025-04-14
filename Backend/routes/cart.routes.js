import { addItemToCart, getCart, getCartCount } from "../controllers/cart.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/", verifyJWT, addItemToCart);
router.get("/count", verifyJWT, getCartCount);

export default router;