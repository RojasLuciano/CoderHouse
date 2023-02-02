import express from 'express';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.set('port', PORT);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => {
    console.log('Server on port:', app.get('port'))
});
server.on('error', error => console.log(`Error on server: ${error}`));

export default app;

