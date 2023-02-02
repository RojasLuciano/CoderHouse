import { Router } from "express";
import { cartController } from "../controller/cart.controller.js";
const cartRouter = Router();

cartRouter.post('/', cartController.addCart); 
cartRouter.get('/:cid', cartController.getCart);
cartRouter.post('/:cid/products/:pid', cartController.addProductToCart);

export default cartRouter;