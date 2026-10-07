import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import commentSchema from '../../schema/post/comment.schema';
import postAssetsSchema from '../../schema/post/post-asset.schema';
import schema from '../../schema/post/post.schema';
import { calculatePagination } from '@/utils/pagination';
import { FilterRequest } from '@/types/app';

class PostController extends CrudService<Post> {
  constructor() {
    super(schema, { paramsId: 'postId' });
  }

  async getAll(req: Request, response: Response): Promise<void | Response> {
    const request = req as FilterRequest<Post>;

    const filters = request.filters;

    const pagination = calculatePagination(request);

    const total = await this.model.countDocuments(filters);

    // comments count
    // share count
    // reaction count

    await this.model
      .find(filters)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .then((items) => {
        response
          .status(statusCode.OK)
          .json({ meta: { ...pagination, total }, data: items });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async delete(request: Request, response: Response) {
    const itemId = request.params[this.paramsId];

    try {
      const post = await schema.findByIdAndDelete(itemId);

      if (post) {
        // Delete assets
        await Promise.all(
          post.assets.map((asset) =>
            postAssetsSchema.findByIdAndDelete(asset._id)
          )
        );

        // Delete comments
        await commentSchema.deleteMany({ post: post._id });

        super.delete(request, response);
      } else {
        response.status(statusCode.NOT_FOUND).json({ error: 'Item not found' });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new PostController();
