const { DataTypes } = require('sequelize');
const db = require('../../db/database');

const Product = db.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    field: 'is_available',
    allowNull: false,
    defaultValue: true
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
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
  tableName: 'products',
  paranoid: true,
  underscored: true
});

module.exports = Product;
