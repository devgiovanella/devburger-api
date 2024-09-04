'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  /*
    O MÉTODO UP É ONDE VAI SER FEITO A CRIAÇÃO DE TABELAS E INSERÇÃO DE DADOS.
    ESTE É O MÉTODO DE FAZER/SUBIR
  */

  async up(queryInterface, Sequelize) {
    // CRIANDO A TABELA DE USUÁRIOS
    await queryInterface.createTable('Users', {
      // COLUNA DO ID
      id: {
        type: Sequelize.UUID, // TIPO DO ID, O UUID VAI GERAR UMA CADEIA DE CARACTERES
        defaultValue: Sequelize.UUIDV4, // 
        primaryKey: true, // É A CHAVE PRIMÁRIA
        allowNull: false // CAMPO NÃO PODE SER NULO
      },
      // COLUNA DO NOME
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // COLUNA DO EMAIL
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // NÃO PODE TER DOIS EMAILS IGUAIS
      },
      // COLUNA DA SENHA CRIPTOGRAFADA
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // COLUNA SE O USUÁRIO É ADMIN
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // SE NÃO PASSSAR NENHUMA INFORMAÇÃO, AUTOMATICAMENTE SERA FALSO
      },
      // COLUNA DE INFORMAÇÕES DE AUDITORIA
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // COLUNA DE INFORMAÇÕES DE AUDITORIA
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  // O MÉTODO DOWN DESFAZ TUDO O QUE FOI FEITO NO MÉTODO UP
  async down(queryInterface) {
    // VAI DROPAR/ EXCLUIR A TABELA DE USUÁRIOS
    await queryInterface.dropTable('Users');
  }
};
