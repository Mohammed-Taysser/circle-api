import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import schema from '../schema/user.schema';

const updateUser = [
  check('password').custom((_, { req }) => {
    if (req.body.password) {
      return check('password')
        .trim()
        .escape()
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required!')
        .bail()
        .isStrongPassword()
        .withMessage('Please provide strong password!')
        .bail()
        .run(req);
    }

    return true;
  }),
  check('firstName').custom((_, { req }) => {
    if (req.body.firstName) {
      return check('firstName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First name can not be empty!')
        .bail()
        .run(req);
    }

    return true;
  }),
  check('lastName').custom((_, { req }) => {
    if (req.body.lastName) {
      return check('lastName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Last name can not be empty!')
        .bail()
        .run(req);
    }

    return true;
  }),
  check('role').custom((_, { req }) => {
    if (req.body.role) {
      return check('role')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('role can not be empty!')
        .isIn(['user', 'admin'])
        .withMessage('Role must be user or admin')
        .bail()
        .run(req);
    }

    return true;
  }),
  check('email').custom((_, { req }) => {
    if (req.body.email) {
      return check('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email an not be empty!')
        .bail()
        .isEmail()
        .withMessage('Invalid email address!')
        .bail()
        .custom(async (email) => {
          return await schema
            .findOne({ email })
            .then((user) => {
              if (user) {
                return Promise.reject('Email already in use');
              }

              return null;
            })
            .catch((error) => Promise.reject(error));
        })
        .bail()
        .run(req);
    }

    return true;
  }),
  check('username').custom((_, { req }) => {
    if (req.body.username) {
      return check('username')
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
          await schema
            .findOne({ username })
            .then((user) => {
              if (user) {
                return Promise.reject('Username already in use');
              }

              return null;
            })
            .catch((error) => Promise.reject(error));
        })
        .bail()
        .run(req);
    }
    return true;
  }),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

export default { updateUser };
