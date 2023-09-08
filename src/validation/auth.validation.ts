import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import schema from '../schema/user.schema';
import { UserInRequest } from '../types/app';
import { comparePassword } from '../utils/password';

const loginValidator = [
  check('password')
    .notEmpty()
    .withMessage('Password can not be empty!')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Minimum 8 characters required!')
    .bail()
    .isStrongPassword()
    .withMessage('Please provide strong password!')
    .bail(),
  check('email')
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .trim()
    .normalizeEmail()
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')

    .bail(),
  async (request: UserInRequest, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    const user = await schema.findOne({ email });

    if (!user) {
      return response.status(statusCode.INTERNAL_SERVER_ERROR).json({
        error: 'User not exist',
      });
    }

    // password is bad
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return response.status(statusCode.INTERNAL_SERVER_ERROR).json({
        error: {
          password: 'Password Not Correct',
        },
      });
    }

    // every thing ok, attach user to request
    request.user = user;

    return next();
  },
];

const registerValidator = [
  check('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password can not be empty!')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Minimum 8 characters required!')
    .bail()
    .isStrongPassword()
    .withMessage('Please provide strong password!')
    .bail(),
  check('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail()
    .custom(async (value) => {
      await schema
        .findOne({ email: value })
        .then((user) => {
          if (user) {
            return Promise.reject('Email already in use');
          }

          return null;
        })
        .catch((error) => Promise.reject(error));
    })
    .bail(),
  check('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Username can not be empty!')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Minimum 8 characters required!')
    .bail()
    .isSlug()
    .withMessage('Please provide username!')
    .bail()
    .custom(async (value) => {
      await schema
        .findOne({ username: value })
        .then((user) => {
          if (user) {
            return Promise.reject('Username already in use');
          }

          return null;
        })
        .catch((error) => Promise.reject(error));
    })
    .bail(),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

const forgotPassword = [
  check('email')
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .trim()
    .normalizeEmail()
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail(),
];

const resetPassword = [
  check('email')
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .trim()
    .normalizeEmail()
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail(),
];

export default {
  login: loginValidator,
  register: registerValidator,
  forgotPassword,
  resetPassword,
};
