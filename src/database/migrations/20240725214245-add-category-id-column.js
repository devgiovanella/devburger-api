// ESSA MIGRATION VAI CRIAR O CAMPO DE RELACIONAMENTO DE CATEGORIAS E PRODUTOS
// AGORA SERÁ UMA FOREIGN KEY

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // criando uma coluna chamada category_id na tabela de products
    await queryInterface.addColumn('Products', 'category_id', {
      // tipo inteiro, pois o id da categoria é do tipo inteiro
      type: Sequelize.INTEGER,
      // dizendo a quem essa coluna está se referenciando
      references: {
        model: 'Categories',
        key: 'id', // a coluna category_id vai receber o id da tabela de categories
      },
      // toda vez que o id da tabela de categorias sofrer um update
      // quero que sofra também um update na tabela de products
      onUpdate: 'CASCADE',
      // toda vez que eu deletar essa coluna na tabela de categorias
      // quero que ele deixe um valor nulo na tabela de products 
      onDelete: 'SET NULL',
      // para deixar como null, precisa ter o allowNull como true
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'category_id');
  }
};
