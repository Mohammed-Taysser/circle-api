import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { AuthenticatedRequest } from 'types/app';
import CrudService from '../core/CRUD';
import schema from '../schema/badge.schema';
import { uploadImage } from '../utils/multer';

class BadgeController extends CrudService<Badge> {
  constructor() {
    super(schema, { simpleFields: ['label'] });
  }

  async update(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const { logo, ...resetBody } = request.body;

    try {
      const body = { ...resetBody };

      if (request.file && request.file.fieldname === 'logo') {
        body.logo = await uploadImage(
          request.file,
          'badges',
          String(request.user._id),
          'badge'
        );
      }

      request.body = body;

      super.update(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new BadgeController();
