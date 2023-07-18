const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const utils = require('../helpers/utils');
const { signUpSchema, signInSchema } = require('../helpers/validation');
const User = require('../models/user');

async function signUp(req, res, next) {
  try {
    const { email, password, name, lastName } = await signUpSchema.validateAsync(req.body);

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw createError.Conflict(`${email} is already registered`);
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
      name,
      lastName
    });

    const token = await utils.generateSignature({ email });
    const data = utils.formatData({ email, token });

    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
}

async function signIn(req, res, next) {
  try {
    const { email, password } = await signInSchema.validateAsync(req.body);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw createError.NotFound('User not registered');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw createError.Unauthorized('Invalid email/password');
    }

    const token = await utils.generateSignature({ email });
    const data = utils.formatData({ email, token });

    res.send(data);
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const { email } = req.payload;

    const user = await User.findOne({
      where: {
        email
      },
      attributes: [ 'name', 'lastName', 'email' ],
      raw: true
    });
    const data = utils.formatData(user);

    res.send(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signUp,
  signIn,
  profile
};
