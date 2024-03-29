import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import schema from '../schema/user.schema';
import { generateToken } from '../utils/jwt';

async function register(request: Request, response: Response) {
  try {
    const body = {
      email: request.body.email,
      password: request.body.password,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      username: request.body.username,
    };

    const user = await new schema(body).save();

    const token = await generateToken(user);

    response.status(statusCode.CREATED).json({ user, token });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function login(request: Request, response: Response) {
  const { user } = request as IRequest;

  const token = await generateToken(user);

  response.status(statusCode.OK).json({
    user,
    token,
  });
}

async function refreshToken(request: Request, response: Response) {
  const { user } = request as IRequest;

  const token = await generateToken(user);
  response.status(statusCode.OK).json({ token });
}

export default { login, register, refreshToken };
