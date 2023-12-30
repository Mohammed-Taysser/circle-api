import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import service from '../services/user.service';
import { comparePassword } from '../utils/password';

const login = [
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
  async (req: Request, response: Response, next: NextFunction) => {
    const request = req as IRequest;

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    const user = await service.getByEmail(email);

    if (!user) {
      return response.status(statusCode.BAD_REQUEST).json({
        error: 'User not exist',
      });
    }

    // password is bad
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return response.status(statusCode.BAD_REQUEST).json({
        error: {
          password: 'Password Not Correct',
        },
      });
    }

    // every thing ok, attach user to request
    request.user = user;

    next();
  },
];

const register = [
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
  check('firstName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('First name can not be empty!')
    .bail(),
  check('lastName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Last name can not be empty!')
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
    .custom(async (email) => {
      await service
        .getByEmail(email)
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
    .custom(async (username) => {
      await service
        .getByUsername(username)
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
    .bail()
    .custom(async (email) => {
      await service
        .getByEmail(email)
        .then((user) => {
          if (!user) {
            return Promise.reject('Email not exist');
          }

          return null;
        })
        .catch((error) => Promise.reject(error));
    })
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
    .bail()
    .custom(async (email) => {
      await service
        .getByEmail(email)
        .then((user) => {
          if (!user) {
            return Promise.reject('Email not exist');
          }

          return null;
        })
        .catch((error) => Promise.reject(error));
    })
    .bail(),
];

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
};
