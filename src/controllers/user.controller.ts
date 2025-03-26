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
      ],
    });

    this.resetPassword = this.resetPassword.bind(this);
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

      super.update(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async resetPassword(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const body = {
      password: request.body.password,
    };

    request.params[this.paramsId] = request.body.id;
    request.body = body;

    super.update(request, response);
  }
}

export default new UserController();
