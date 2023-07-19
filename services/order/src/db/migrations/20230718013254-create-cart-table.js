'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('carts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      products: {
        type: Sequelize.JSONB
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('carts');
  }
};
