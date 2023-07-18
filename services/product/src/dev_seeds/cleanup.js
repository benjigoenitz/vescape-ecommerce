const db = require('../db/database');

module.exports = {
  run: async() => {
    await db.query('DELETE FROM products');
  }
};
