const { DataTypes } = require('sequelize');
const db = require('../../db/database');

const OrderLine = db.define('order_lines', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id'
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id'
  },
  productName: {
    type: DataTypes.STRING,
    field: 'product_name'
  },
  productPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'product_price'
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
},
{
  tableName: 'order_lines',
  paranoid: true,
  underscored: true,
  classMethods: {
    associate(models) {
      OrderLine.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
    }
  }
});

module.exports = OrderLine;
