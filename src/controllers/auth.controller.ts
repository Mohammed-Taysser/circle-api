import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { AuthenticatedRequest, JwtTokenPayload } from 'types/app';
import schema from '../schema/user.schema';
import { generateToken } from '../utils/jwt';
import { comparePassword } from '@/utils/bcrypt';
import mailService from '@/utils/nodemailer';

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

    const jwtPayload: JwtTokenPayload = {
      _id: String(user._id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    const token = await generateToken(jwtPayload);

    await mailService.sendEmail({
      to: user.email,
      subject: 'Welcome to Circle',
      html: `
        <h1>Hi ${user.firstName},</h1>
        <p>Thank you for registering to Circle. We are excited to have you on board.</p>
        <p>Here are your login details:</p>
        <ul>
          <li>Username: ${user.username}</li>
          <li>Password: ${body.password}</li>
        </ul>
        <p>Use these credentials to log in to your account.</p>
        <p>Best regards,<br>The Circle Team</p>
      `,
    });

    const { password, ...userWithoutPassword } = user.toObject();

    response
      .status(statusCode.CREATED)
      .json({ data: { user: userWithoutPassword, token } });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function login(request: Request, response: Response) {
  const { email, password } = request.body;

  const user = await schema.findOne({ email }).select('+password');

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

  const token = await generateToken(user);

  response.status(statusCode.OK).json({
    user,
    token,
  });
}

async function refreshToken(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;

  const token = await generateToken(user);

  response.status(statusCode.OK).json({ data: token });
}

async function me(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;

  response.status(statusCode.OK).json({ data: user });
}

export default { login, register, refreshToken, me };
