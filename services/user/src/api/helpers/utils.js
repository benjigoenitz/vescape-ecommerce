const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/config');

const formatData = (data) => {
  return { data };
};

const generateSignature = async(payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  formatData,
  generateSignature
};
