/* eslint-disable no-undef */
const bcrypt = require('bcryptjs');
const userController = require('./user');
const utils = require('../helpers/utils');
const { signUpSchema, signInSchema } = require('../helpers/validation');
const User = require('../models/user');

describe('User Controller', () => {
  // fixtures
  const email = 'email@email.com';
  const password = 'password';
  const name = 'name';
  const lastName = 'lastName';
  const existingUser = { email };
  const newuser = { id: 1, email, password, name, lastName };
  const next = jest.fn();
  const body = { email, password };
  const req = { body };
  const token = 'token';
  const res = { status: jest.fn(() => ({ send: jest.fn() })), send: jest.fn() };
  const joiError = { isJoi: true, status: 400, message: 'Invalid email' };

  describe('signUp', () => {
    beforeEach(() => {
      jest.spyOn(signUpSchema, 'validateAsync').mockImplementation(() => {
        return { email, password, name, lastName };
      });
      jest.spyOn(User, 'findOne').mockImplementation(() => null);
      jest.spyOn(User, 'create').mockImplementation(() => newuser);
      jest.spyOn(utils, 'generateSignature').mockImplementation(() => token);
      jest.spyOn(utils, 'formatData').mockImplementation(() => ({ email, token }));
      jest.spyOn(bcrypt, 'genSaltSync').mockImplementation(() => 'saltysalt');
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next joi error if email is invalid', async() => {
      jest.spyOn(signUpSchema, 'validateAsync').mockImplementation(() => {
        throw joiError;
      });

      await userController.signUp(req, res, next);

      expect(signUpSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(0);
      expect(User.create).toHaveBeenCalledTimes(0);
      expect(bcrypt.genSaltSync).toHaveBeenCalledTimes(0);
      expect(bcrypt.hash).toHaveBeenCalledTimes(0);
      expect(utils.generateSignature).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].isJoi).toEqual(true);
      expect(next.mock.calls[0][0].status).toEqual(400);
      expect(next.mock.calls[0][0].message).toEqual('Invalid email');
    });

    it('should next error 409 if emails is already registered', async() => {
      jest.spyOn(User, 'findOne').mockImplementation(() => existingUser);

      await userController.signUp(req, res, next);

      expect(signUpSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledTimes(0);
      expect(bcrypt.genSaltSync).toHaveBeenCalledTimes(0);
      expect(bcrypt.hash).toHaveBeenCalledTimes(0);
      expect(utils.generateSignature).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(409);
      expect(next.mock.calls[0][0].message).toEqual(`${email} is already registered`);
    });

    it('should send email and token as response if there was no issue', async() => {

      await userController.signUp(req, res, next);

      expect(signUpSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.genSaltSync).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(utils.generateSignature).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status.mock.calls[0][0]).toEqual(201);
    });
  });

  describe('signIn', () => {

    beforeEach(() => {
      jest.spyOn(signInSchema, 'validateAsync').mockImplementation(() => {
        return { email, password };
      });
      jest.spyOn(User, 'findOne').mockImplementation(() => existingUser);
      jest.spyOn(utils, 'generateSignature').mockImplementation(() => token);
      jest.spyOn(utils, 'formatData').mockImplementation(() => ({ email, token }));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next joi error if email is invalid', async() => {
      jest.spyOn(signInSchema, 'validateAsync').mockImplementation(() => {
        throw joiError;
      });

      await userController.signIn(req, res, next);

      expect(signInSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(0);
      expect(bcrypt.compare).toHaveBeenCalledTimes(0);
      expect(utils.generateSignature).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].isJoi).toEqual(true);
      expect(next.mock.calls[0][0].status).toEqual(400);
      expect(next.mock.calls[0][0].message).toEqual('Invalid email');
    });

    it('should next error 404 if email is not registered', async() => {
      jest.spyOn(User, 'findOne').mockImplementation(() => null);

      await userController.signIn(req, res, next);

      expect(signInSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(0);
      expect(utils.generateSignature).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(404);
      expect(next.mock.calls[0][0].message).toEqual('User not registered');
    });

    it('should next error 401 if password is incorrect', async() => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await userController.signIn(req, res, next);

      expect(signInSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(utils.generateSignature).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(401);
      expect(next.mock.calls[0][0].message).toEqual('Invalid email/password');
    });

    it('should send email and token if there was no issue', async() => {

      await userController.signIn(req, res, next);

      expect(signInSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(utils.generateSignature).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send.mock.calls[0][0]).toEqual({ email, token });
    });
  });

  describe('profile', () => {

    beforeEach(() => {
      req.payload = { email };
      jest.spyOn(User, 'findOne').mockImplementation(() => existingUser);
      jest.spyOn(utils, 'formatData').mockImplementation(() => ({ email, name, lastName }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next error if User.findOne throws an error', async() => {
      jest.spyOn(User, 'findOne').mockImplementation(() => {
        throw Error('error');
      });

      await userController.profile(req, res, next);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return profile if there was no issue', async() => {

      await userController.profile(req, res, next);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send.mock.calls[0][0]).toEqual({ name, lastName, email });
    });
  });

});

