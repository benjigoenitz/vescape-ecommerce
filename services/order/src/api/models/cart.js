const { DataTypes } = require('sequelize');
const db = require('../../db/database');

const Cart = db.define('cart', {
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
  products: {
    type: DataTypes.JSONB
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
  tableName: 'carts',
  paranoid: true,
  underscored: true
});

module.exports = Cart;
