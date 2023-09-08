import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/user.schema';
import { UserInRequest } from '../types/app';
import { generateToken } from '../utils/jwt';

async function register(request: Request, response: Response) {
  try {
    const newUser = new schema({
      username: request.body.username,
      password: request.body.password,
      email: request.body.email,
    });

    const user = await newUser.save();

    const token = await generateToken(user);

    response.status(statusCode.CREATED).json({ user, token });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function login(request: UserInRequest, response: Response) {
  const { user } = request;

  const token = await generateToken(user);
  response.status(statusCode.OK).json({
    user,
    token,
  });
}

async function refreshToken(request: UserInRequest, response: Response) {
  const { user } = request;

  const token = await generateToken(user);
  response.status(statusCode.OK).json({ token });
}

export default { login, register, refreshToken };
