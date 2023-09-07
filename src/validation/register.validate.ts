import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import schema from '../schema/user.schema';

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

export default registerValidator;
