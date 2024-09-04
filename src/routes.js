// IMPORTAR DE DENTRO DO EXPRESS O ROUTER
import { Router } from 'express';

// IMPORTANDO O MULTER
import multer from 'multer';

// IMPORTANDO A CONFIGURAÇÃO DO MULTER (ARQUIVO multer.js)
import multerConfig from './config/multer';

// IMPORTANDO O MIDDLEWARE DO TOKEN
import authMiddleware from './app/middlewares/auth';

// IMPORTAR O USER CONTROLLER
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

//INSTANCIANDO A CLASSE ROUTER
const routes = new Router();

const uploads = multer(multerConfig);

// PARA TESTAR
/*routes.get('/', async (request, response) => {

   const user = await User.create({
      id: v4(),
      name:'Luis Felipe Giovanella',
      email: 'luis.felipe.g@gmail.com',
      password_hash: 'q6qw5q66as99q5'
   })

   return response.status(201).json(user);	
})*/

routes.post('/session', SessionController.store);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

// com isso, o authMiddleware passa a ser necessário as rotas que estiverem abaixo dessa linha
// executa antes das rotas abaixo
routes.use(authMiddleware);
routes.post('/products', uploads.single('file'), ProductController.store);
// ROTA QUE VAI LISTAR OS PRODUTOS
// E AO LISTAR, COM O METODO index, RECUPERA-SE A URL
// DEPOIS DE RECUPERAR A URL PRECISA SERVIR O ARQUIVO NESSA URL
// LA NO app.js AVISA-SE O EXPRESS
routes.get('/products', ProductController.index);
routes.put('/products/:id', uploads.single('file'), ProductController.update);
routes.delete('/products/:id', ProductController.delete);

routes.post('/categories', uploads.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', uploads.single('file'), CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

// EXPORTANDO 
export default routes;