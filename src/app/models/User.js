// O MODEL É ONDE VAMOS CONSEGUIR SE COMUNICAR COM O BANCO DE DADOS
// É A REPRESENTAÇÃO DA NOSSA ENTIDADE NO BANCO DE DADOS PRO NOSSO CÓDIGO SABER O QUE TEM NO BANCO
// O QUE PODE EXECUTAR, COLUNAS E CAMPOS

// IMPORTANDO O SEQUELIZE E O MODEL DE DENTRO DO sequelize
import Sequelize, { Model }  from "sequelize";

import bcrypt from 'bcrypt';

// CRIAÇÃO DA CLASSE USER HERDANDO DE MODEL (USA TUDO O QUE TEM DENTRO DE MODEL)
class User extends Model {
    // COM O STATIC NÃO É PRECISO INSTANCIAR A CLASSE
    static init(sequelize) {
        // O super QUER DIZER QUE ESTAMOS UTILIZANDO A FUNÇÃO init() LA DO MODEL CLASSE PAI  E NÃO DA CLASE DE USER
        super.init({
            // CAMPO DE ID -> É PK, ENTÃO O SEQUELIZE ENTENDE E CRIA AUTOMÁTICO
            name: Sequelize.STRING,
            email:Sequelize.STRING,
            // UM CAMPO VIRTUAL EXISTE APENAS NA APLICAÇÃO, NÃO EXISTE NO BANCO DE DADOS
            //
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            admin: Sequelize.BOOLEAN,
            // CAMPO CREATED_AT -> NO ARQUIVO DATABASE.JS O TIMESTAMPS ESTÁ COMO TRUE, VAI AUTOMATICO
            // CAMPO UPDATED_AT -> NO ARQUIVO DATABASE.JS O TIMESTAMPS ESTÁ COMO TRUE, VAI AUTOMATICO
        }, {sequelize});

        // USANDO O THIS TAMBÉM CONSIGO CHAMAR MÉTODOS DA MODEL, COMO NÃO TEM MÉTODOS IGUAIS
        // O addHook ADICIONA UMA AÇÃO EM ALGUM MOMENTO QUE O SEQUELIZE FAZ ALGO NO BANCO
        // ENTÃO ANTES(before) DE SALVAR, VOU RECUPERAR O USER COM UMA FUNÇÃO DE CALLBACK
        this.addHook('beforeSave', async (user) => {
            if(user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10); // método assíncrono
                // O método hash() espera como parametro, o que vamos criptografar e a 
                // força da criptografia
            }
        })
        
        return this;
    }


    async checkPassword(password) {
        // para usar as propriedades de user usa-se o this 
        // o compare() é um método assincrono
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;