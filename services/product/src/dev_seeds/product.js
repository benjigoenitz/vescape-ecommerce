const Product = require('../api/models/product');
const productData = [ {
  name: 'Playstation 5',
  description: 'Sony Game Console',
  price: 499.99
},
{
  name: 'Xbox Series X',
  description: 'Microsoft Game Console',
  price: 599.99
},
{
  name: 'Nintendo Switch',
  description: 'Nintendo Game Console',
  price: 299.99
} ];

module.exports = {
  run: () => Promise.all(productData.map(async product => {
    await Product.create(product);
  }))
};
