import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import postAssetsSchema from '../../schema/post/post-asset.schema';
import postSchema from '../../schema/post/post.schema';

class PostAssetController extends CrudService<PostAsset> {
  constructor() {
    super(postAssetsSchema, { paramsId: 'assetId' });
  }

  async getAll(request: Request, response: Response) {
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        response.status(statusCode.NOT_FOUND).json({ error: 'Post not found' });
      } else {
        response.status(statusCode.OK).json({ data: post.assets });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async getById(request: Request, response: Response) {
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        return response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Post not found' });
      }

      super.getById(request, response);
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
        const asset = await new this.model(request.body).save();

        await postSchema.findByIdAndUpdate(postId, {
          $push: { assets: asset._id },
        });

        response.status(statusCode.CREATED).json({ data: asset });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async delete(request: Request, response: Response) {
    const { postId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        return response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Post not found' });
      }

      super.delete(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new PostAssetController();
