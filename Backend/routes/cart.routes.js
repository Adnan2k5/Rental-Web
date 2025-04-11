import { addItemToCart, removeItemFromCart, getCart } from "../controllers/cart.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyJWT, addItemToCart);
router.post("/remove", verifyJWT, removeItemFromCart);
router.get("/", verifyJWT, getCart);

export default router;