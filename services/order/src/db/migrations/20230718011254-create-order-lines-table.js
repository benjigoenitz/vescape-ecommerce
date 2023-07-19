'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('order_lines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.STRING
      },
      product_price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      quantity: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('order_lines');
  }
};
