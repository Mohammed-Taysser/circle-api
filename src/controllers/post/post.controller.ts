import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import commentSchema from '../../schema/post/comment.schema';
import postAssetsSchema from '../../schema/post/post-asset.schema';
import schema from '../../schema/post/post.schema';

class PostController extends CrudService<Post> {
  constructor() {
    super(schema, { paramsId: 'postId' });
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
