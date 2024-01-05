import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import service from '../services/user.services';
import { generateToken } from '../utils/jwt';

async function register(request: Request, response: Response) {
  try {
    const user = await service.save(request.body);

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
