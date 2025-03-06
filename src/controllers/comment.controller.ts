import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../core/CRUD';
import commentSchema from '../schema/comment.schema';
import postSchema from '../schema/post.schema';
import { calculatePagination } from '../utils/pagination';

class CommentController extends CrudService<Comment> {
  constructor() {
    super(commentSchema, { paramsId: 'commentId' });
  }

  async getAll(request: Request, response: Response) {
    const { postId } = request.params;

    const total = await this.model.countDocuments();

    const pagination = calculatePagination(request);

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        response.status(statusCode.NOT_FOUND).json({ error: 'Post not found' });
      } else {
        const comments = await this.model
          .find({ post: post._id })
          .skip(pagination.skip)
          .limit(pagination.limit);

        response
          .status(statusCode.OK)
          .json({ meta: { ...pagination, total }, data: comments });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async create(request: Request, response: Response) {
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        response.status(statusCode.NOT_FOUND).json({ error: 'Post not found' });
      } else {
        const body = {
          ...request.body,
          post: postId,
        };
        const comment = await new this.model(body).save();

        response.status(statusCode.CREATED).json({ data: comment });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new CommentController();
