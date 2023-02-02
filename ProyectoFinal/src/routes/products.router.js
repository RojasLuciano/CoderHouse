import { Router } from 'express';
import { productController } from '../controller/product.controller.js';
const productsRouter = Router();

productsRouter.get('/:pid', productController.getProductById);    
productsRouter.get('/', productController.getProducts);        
productsRouter.post('/', productController.addProduct);                      
productsRouter.put('/:pid', productController.updateProduct);              
productsRouter.delete('/:pid', productController.deleteProduct); 

export default productsRouter;