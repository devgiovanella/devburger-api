// AQUI VAMOS CONECTAR AS MODELS COM O BANCO DE DADOS

// IMPORTAR O SEQUELIZE
import { Sequelize } from "sequelize";

// IMPORTAR A CONFIGURAÇÃO DO BANCO
//import configDatabase from '../config/database';

// IMPORTAR O MONGOOSE, O MONGODB NÃO SE CONECTA COM O SEQUELIZE
import mongoose from 'mongoose';

// IMPORTAR AS MODELS
import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

// ARRAY QUE VAI ARMAZENAR AS MODELS
// AVISANDO O SEQUELIZE QUE EXISTEM ESSAS MODELS
const models = [User, Product, Category];



class Database {
    constructor() {
        // TODA VEZ QUE UMA CLASSE FOR INSTACIADA, O MÉTODO INIT É CHAMADO
        this.init();
        this.mongo();
    }

    init() {
        // CRIANDO UMA CONNECTION PASSANDO A CONFIGUAÇÃO DO BANCO E AS MODELS DENTRO DE UM MAP
        this.connection = new Sequelize('postgresql://postgres:tnnQligBNDpHRjOlWKhGbUNMIXDjpLJY@autorack.proxy.rlwy.net:43357/railway');
        // DANDO UM MAP NAS MODELS, CHAMANDO O INIT LA DOS MODELS E CONECTANDO
        models.map((model) => model.init(this.connection))
            // AVISANDO O SEQUELIZE QUE EXISTEM ESSES RELACIONAMENTOS
            // DANDO UM MAP NA MODEL E SE HOUVER O MÉTODO ASSOCIATE, SE HOUVER, CONECTA
            // SE FOR TRUE, EXECUTA O QUE ESTÁ DO LADO DIREITO DO &&
            .map(model => model.associate && model.associate(this.connection.models));
    }
    // O MONGODB NÃO SE CONECTA COM O SEQUELIZE
    // AQUI VAI CONECTART COM O MONGO
    mongo() {
        this.mongoConnection = mongoose.connect(
            'mongodb://mongo:DsgaFNakyXHAJAechGTKnVEEdjweYhPN@junction.proxy.rlwy.net:33243',
        );
    }
}

// EXPORTANDO JÁ INSTANCIADO
export default new Database();