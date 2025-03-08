import { Request, Response } from 'express';
import CrudService from '../core/CRUD';
import schema from '../schema/user.schema';
import { AuthenticatedRequest } from '../types/app';

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

  async update(request: Request, response: Response) {
    const { avatar, cover, ...resetBody } = request.body;

    const body = {
      ...resetBody,
    };

    if (request.file) {
      body.avatar = request.file.path.split('public')[1];
    }

    request.body = body;

    super.update(request, response);
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
