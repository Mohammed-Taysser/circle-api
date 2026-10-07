import { Request, Response } from 'express';
import CrudService from '../core/CRUD';
import schema from '../schema/user.schema';
import statusCode from 'http-status-codes';
import { AuthenticatedRequest } from '../types/app';
import { uploadUserOrGroupImage } from '../utils/multer';

class UserController extends CrudService<User> {
  constructor() {
    super(schema, {
      whitelistFields: [
        'username',
        'firstName',
        'lastName',
        'avatar',
        'cover',
        'status',
        'badges',
        'bookmarks',
        'isVerified', // TODO: only admin can update
        'role', // TODO: only admin can update
        'email', // TODO: only admin can update
      ],
      simpleFields: ['firstName', 'lastName'],
    });

    this.resetPassword = this.resetPassword.bind(this);
  }

  async create(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const { avatar, cover, ...resetBody } = request.body;

    try {
      const body = { ...resetBody };

      const avatarUrl = await uploadUserOrGroupImage(
        request,
        'users',
        'avatar'
      );
      if (avatarUrl) {
        body.avatar = avatarUrl;
      }

      const coverUrl = await uploadUserOrGroupImage(request, 'users', 'cover');
      if (coverUrl) {
        body.cover = coverUrl;
      }

      request.body = body;

      await super.create(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async update(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const { avatar, cover, ...resetBody } = request.body;

    try {
      const body = { ...resetBody };

      const avatarUrl = await uploadUserOrGroupImage(
        request,
        'users',
        'avatar'
      );
      if (avatarUrl) {
        body.avatar = avatarUrl;
      }

      const coverUrl = await uploadUserOrGroupImage(request, 'users', 'cover');
      if (coverUrl) {
        body.cover = coverUrl;
      }

      request.body = body;

      await super.update(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async resetPassword(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const body = {
      password: request.body.password,
    };

    const userId = request.params[this.paramsId];

    await this.model
      .findByIdAndUpdate(userId, body, {
        runValidators: true,
        new: true,
      })
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }
}

export default new UserController();
