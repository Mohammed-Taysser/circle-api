import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';
import Joi from 'joi';

const createBadge = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const schema = Joi.object().keys({
    body: Joi.string().required(),
    label: Joi.string().required(),
  });

  const { error } = schema.validate(request.body);

  if (error) {
    response.status(statusCode.BAD_REQUEST).json({ errors: error.details });
  } else {
    next();
  }
};

const updateBadge = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const schema = Joi.object().keys({
    body: Joi.string(),
    label: Joi.string(),
  });

  const { error } = schema.validate(request.body);

  if (error) {
    response.status(statusCode.BAD_REQUEST).json({ errors: error.details });
  } else {
    next();
  }
};

export default {
  create: createBadge,
  update: updateBadge,
};
