const { DataTypes } = require('sequelize');
const db = require('../../db/database');

const Order = db.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'amount',
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    values: [ 'PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED' ],
    defaultValue: 'PENDING'
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
  tableName: 'orders',
  paranoid: true,
  underscored: true,
  classMethods: {
    associate(models) {
      Order.hasMany(models.OrderLine, {
        foreignKey: 'order_id',
        as: 'order_lines'
      });
    }
  }
});

module.exports = Order;
