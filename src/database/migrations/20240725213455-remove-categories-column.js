// ESSA MIGRATION VAI REMOVER A COLUNA DE CATEGORY NA TABELA DE PRODUCTS

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // vai remover a coluna category da tabela de products 
    await queryInterface.removeColumn('Products', 'category');
  },

  async down(queryInterface, Sequelize) {
    // vai criar uma coluna chamada category na tabela de produtos
    await queryInterface.addColumn('Products', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
