// VAI CRIAR UMA COLUNA CHAMADA OFFER DENTRO DA TABELA DE PRODUTOS

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'offer', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'offer');
  }
};
