import { AuthenticatedRequest } from 'types/app';
import CrudService from '../core/CRUD';
import schema from '../schema/group.schema';
import { Request, Response } from 'express';
import { uploadUserOrGroupImage } from '../utils/multer';
import statusCode from 'http-status-codes';

class GroupController extends CrudService<Group> {
  constructor() {
    super(schema, { simpleFields: ['name'] });
  }

  async update(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const { avatar, cover, ...resetBody } = request.body;

    try {
      const body = { ...resetBody };

      const avatarUrl = await uploadUserOrGroupImage(
        request,
        'groups',
        'avatar'
      );
      if (avatarUrl) {
        body.avatar = avatarUrl;
      }

      const coverUrl = await uploadUserOrGroupImage(request, 'groups', 'cover');
      if (coverUrl) {
        body.cover = coverUrl;
      }

      request.body = body;

      super.update(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new GroupController();
