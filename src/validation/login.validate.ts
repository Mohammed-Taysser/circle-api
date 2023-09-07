import { NextFunction, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import { UserInRequest } from '../core/app';
import schema from '../schema/user.schema';
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

export default loginValidator;
