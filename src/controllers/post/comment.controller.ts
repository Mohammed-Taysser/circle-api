import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import commentSchema from '../../schema/post/comment.schema';
import postSchema from '../../schema/post/post.schema';
import { FilterRequest } from 'types/app';

class CommentController extends CrudService<UserComment> {
  constructor() {
    super(commentSchema, { paramsId: 'commentId' });
  }

  async getAll(req: Request, response: Response) {
    const request = req as FilterRequest<UserComment>;
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        return response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Post not found' });
      }

      request.filters = { post: postId };

      super.getAll(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async create(request: Request, response: Response) {
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        return response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Post not found' });
      }

      const body = {
        ...request.body,
        post: postId,
      };

      request.body = body;

      super.create(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new CommentController();
