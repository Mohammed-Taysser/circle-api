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
    const { postId, assetId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        response.status(statusCode.NOT_FOUND).json({ error: 'Post not found' });
      } else {
        const assetItem = post.assets.find(
          (item) => item._id.toString() === assetId
        );

        if (!assetItem) {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Asset not found' });
        } else {
          response.status(statusCode.OK).json({ data: assetItem });
        }
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
    const { postId, assetId } = request.params;

    try {
      const post = await postSchema.findById(postId);

      if (!post) {
        response.status(statusCode.NOT_FOUND).json({ error: 'Post not found' });
      } else {
        const assetItem = post.assets.find(
          (item) => item._id.toString() === assetId
        );

        if (!assetItem) {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Asset not found' });
        } else {
          await this.model.findByIdAndDelete(assetId);

          await postSchema.findByIdAndUpdate(postId, {
            $pull: { assets: assetId },
          });

          response.status(statusCode.OK).json({ data: assetItem });
        }
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new PostAssetController();
