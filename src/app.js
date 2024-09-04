// IMPORTANDO O EXPRESS
import express from 'express';
// IMPORTANDO O ROUTES DE DENTRO DO ARQUIVO routes.js
import routes from './routes';

// IMPORTANDO O RESOLVE
import { resolve } from 'node:path';

// IMPORTANDO O DATABASE, JÁ VAI INSTANCIAR ASSIM QUE INICIAR A APLICAÇÃO, POR ISSO SEM NOME
import './database';

// IMPORTANDO O CORS
import cors from 'cors';

class App {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    // TODA VEZ QUE ALGUÉM BATER NA ROTA /product-file VAI SERVIR OS ARQUIVOS QUE ESTÃO 
    // NA PASTA uploads
    this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads')));
    this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
