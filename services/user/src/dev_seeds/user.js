const User = require('../api/models/user');
const userData = [ {
  name: 'John',
  lastName: 'Doe',
  email: 'admin@email.com',
  password: '$2a$10$O6zj8vb8kNgVxNtMCTHt1Ox.uD.dYwsZC6Eo4gM2rZUYA89FeXHZS', // Pass@word123
  role: 'admin'
} ];

module.exports = {
  run: () => Promise.all(userData.map(async user => {
    await User.create(user);
  }))
};
