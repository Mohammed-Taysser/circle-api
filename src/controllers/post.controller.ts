import { Request, Response } from 'express';
import CrudService from '../core/CRUD';
import statusCode from 'http-status-codes';
import schema from '../schema/post.schema';
import postAssetsSchema from '../schema/PostAsset.schema';
import commentSchema from '../schema/comment.schema';

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

        response.status(statusCode.OK).json({ data: post });
      } else {
        response.status(statusCode.NOT_FOUND).json({ error: 'Item not found' });
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new PostController();

// async function allPosts(request: Request, response: Response) {
//   const pagination = calculatePagination(request);

//   const total = await postSchema.countDocuments();

//   try {
//     const postsWithoutCount = await postSchema
//       .find()
//       .skip(pagination.skip)
//       .limit(pagination.limit)
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       })
//       .then((posts) => posts.map((post) => post.toObject()));

//     const posts = await Promise.all(
//       postsWithoutCount.map(async (post) => {
//         const comments = await commentSchema.countDocuments({
//           post: post._id,
//         });

//         const reactions = await reactionSchema.find({ post: post._id });

//         return { ...post, comments, reactions };
//       })
//     );

//     response.status(statusCode.OK).json({ posts, total });
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function getPost(request: Request, response: Response) {
//   const { id } = request.params;

//   try {
//     const post = await postSchema
//       .findById(id)
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       })
//       .then((post) => post?.toObject());

//     const commentsCount = await commentSchema.countDocuments({ post: id });

//     const reactions = await reactionSchema
//       .find({ post: id })
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       })
//       .select('-post');

//     if (post) {
//       post.comments = commentsCount;

//       post.reactions = reactions;

//       response.status(statusCode.OK).json({ post });
//     } else {
//       response.status(statusCode.NOT_FOUND).json({ error: 'post not exist' });
//     }
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function createPost(req: Request, response: Response) {
//   const request = req as IRequest;

//   const files = request.files as Record<string, MFile[]>;

//   try {
//     const body = {
//       user: request.user._id,
//       body: request.body?.body,
//       visibility: request.body?.visibility,
//       variant: request.body?.variant,
//       activity: request.body?.activity,
//       assets: {
//         gallery: request.body?.gallery,
//         youtube: request.body?.youtube,
//         audio: request.body?.audio,
//         video: request.body?.video,
//       },
//     };

//     if (files?.video) {
//       body.assets.video = await cloudinary.posts.uploadVideo(files.video[0]);
//     }

//     if (files?.audio) {
//       body.assets.audio = await cloudinary.posts.uploadAudio(files.audio[0]);
//     }

//     if (files?.gallery) {
//       body.assets.gallery = await cloudinary.posts.uploadGallery(files.gallery);
//     }

//     const savedPost = await new postSchema(body).save();

//     const post = await postSchema.findById(savedPost._id).populate({
//       path: 'user',
//       select: 'firstName lastName username avatar',
//     });

//     response.status(statusCode.CREATED).json({ post });
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function updatePost(req: Request, response: Response) {
//   const request = req as IRequest;

//   const files = request.files as Record<string, MFile[]>;

//   const { id } = request.params;

//   await postSchema
//     .findById(id)
//     .then(async (postInstance) => {
//       if (postInstance) {
//         try {
//           const body = {
//             user: request.user._id,
//             body: request.body?.body,
//             visibility: request.body?.visibility,
//             variant: request.body?.variant,
//             activity: request.body?.activity,
//             assets: {
//               gallery: request.body?.gallery,
//               youtube: request.body?.youtube,
//               audio: request.body?.audio,
//               video: request.body?.video,
//             },
//           };

//           if (files?.video) {
//             body.assets.video = await cloudinary.posts.uploadVideo(
//               files.video[0],
//               postInstance?.assets?.video
//             );
//           }

//           if (files?.audio) {
//             body.assets.audio = await cloudinary.posts.uploadAudio(
//               files.audio[0],
//               postInstance?.assets?.audio
//             );
//           }

//           if (files?.gallery) {
//             body.assets.gallery = await cloudinary.posts.uploadGallery(
//               files.gallery,
//               postInstance?.assets?.gallery
//             );
//           }

//           const post = await postSchema
//             .findByIdAndUpdate(id, body, {
//               new: true,
//             })
//             .populate({
//               path: 'user',
//               select: 'firstName lastName username avatar',
//             });

//           response.status(statusCode.OK).json({ post });
//         } catch (error) {
//           response.status(statusCode.BAD_REQUEST).json({ error });
//         }
//       } else {
//         response
//           .status(statusCode.BAD_REQUEST)
//           .json({ error: 'Post Not Exist' });
//       }
//     })
//     .catch(() => {
//       response.status(statusCode.BAD_REQUEST).json({ error: 'Post Not Exist' });
//     });
// }

// async function deletePost(req: Request, response: Response) {
//   const request = req as IRequest;

//   const { id } = request.params;

//   try {
//     const deletedPost = await postSchema
//       .findByIdAndDelete(id, { new: true })
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       })
//       .then((post) => post?.toObject());

//     if (deletedPost) {
//       const comments = await commentSchema.deleteMany({ post: id });

//       const reactions = await reactionSchema.deleteMany({ post: id });

//       response.status(statusCode.OK).json({
//         post: {
//           ...deletedPost,
//           comments: comments.deletedCount,
//           reactions: reactions.deletedCount,
//         },
//       });
//     } else {
//       response.status(statusCode.NOT_FOUND).json({ error: 'post not exist' });
//     }
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function search(request: Request, response: Response) {
//   const pagination = calculatePagination(request);
//   const searchQuery = request.query.query ?? '';

//   let sort = '-createAt';

//   switch (request.query.sort) {
//     case 'latest':
//       sort = '-createdAt';
//       break;
//     case 'oldest':
//       sort = 'createdAt';
//       break;
//   }

//   const queryFilter = {
//     $or: [{ body: { $regex: searchQuery, $options: 'i' } }],
//   };

//   try {
//     const total = await postSchema.countDocuments(queryFilter);

//     const postsWithoutComments = await postSchema
//       .find(queryFilter)
//       .skip(pagination.skip)
//       .limit(pagination.limit)
//       .sort(sort)
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       });

//     const posts = await Promise.all(
//       postsWithoutComments.map(async (post) => {
//         const comments = await commentSchema.countDocuments({ post: post._id });

//         const reactions = await reactionSchema.find({ post: post._id });
//         return { ...post.toObject(), comments, reactions };
//       })
//     );

//     response.status(statusCode.OK).json({ posts, total });
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function getPostComments(request: Request, response: Response) {
//   const pagination = calculatePagination(request);

//   const total = await commentSchema.countDocuments({
//     post: request.params.postId,
//   });

//   await commentSchema
//     .find({ post: request.params.postId })
//     .skip(pagination.skip)
//     .limit(pagination.limit)
//     .populate({
//       path: 'user',
//       select: 'firstName lastName username avatar',
//     })
//     .select('-post')
//     .then((comments) => {
//       response.status(statusCode.OK).json({ comments, total });
//     })
//     .catch((error) => {
//       response.status(statusCode.BAD_REQUEST).json({ error });
//     });
// }

// async function addComment(req: Request, response: Response) {
//   const request = req as IRequest;

//   const body = {
//     body: request.body.body,
//     user: request.user._id,
//     post: request.params.postId,
//   };

//   try {
//     const savedComment = await new commentSchema(body).save();

//     const comment = await commentSchema
//       .findById(savedComment._id)
//       .populate({
//         path: 'user',
//         select: 'firstName lastName username avatar',
//       })
//       .select('-post');

//     response.status(statusCode.OK).json({ comment });
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// async function deleteComment(req: Request, response: Response) {
//   const request = req as IRequest;

//   const { commentId } = request.params;

//   await commentSchema
//     .findByIdAndDelete(commentId)
//     .populate({
//       path: 'user',
//       select: 'firstName lastName username avatar',
//     })
//     .select('-post')
//     .then((comment) => {
//       if (comment) {
//         response.status(statusCode.OK).json({ comment });
//       } else {
//         response
//           .status(statusCode.NOT_FOUND)
//           .json({ error: 'comment not exist' });
//       }
//     })
//     .catch((error) => {
//       response.status(statusCode.BAD_REQUEST).json({ error });
//     });
// }

// async function react(req: Request, response: Response) {
//   const request = req as IRequest;

//   const body = {
//     react: request.body.react,
//     user: request.user._id,
//     post: request.params.postId,
//   };

//   try {
//     const existingReaction = await reactionSchema.findOne({
//       post: request.params.postId,
//       user: request.user._id,
//     });

//     if (existingReaction) {
//       if (existingReaction.react === body.react) {
//         await reactionSchema
//           .findByIdAndDelete(existingReaction._id, { new: true })
//           .populate({
//             path: 'user',
//             select: 'firstName lastName username avatar',
//           })
//           .select('-post')
//           .then((reaction) => {
//             response.status(statusCode.OK).json({ reaction });
//           })
//           .catch((error) => {
//             response.status(statusCode.BAD_REQUEST).json({ error });
//           });
//       } else {
//         const reaction = await reactionSchema
//           .findByIdAndUpdate(existingReaction._id, body, { new: true })
//           .populate({
//             path: 'user',
//             select: 'firstName lastName username avatar',
//           })
//           .select('-post')
//           .then((reaction) => reaction?.toObject());

//         response.status(statusCode.OK).json({ reaction });
//       }
//     } else {
//       const savedReaction = await new reactionSchema(body).save();

//       const reaction = await reactionSchema
//         .findById(savedReaction._id)
//         .populate({
//           path: 'user',
//           select: 'firstName lastName username avatar',
//         })
//         .select('-post');
//       response.status(statusCode.OK).json({ reaction });
//     }
//   } catch (error) {
//     response.status(statusCode.BAD_REQUEST).json({ error });
//   }
// }

// export default {
//   allPosts,
//   getPost,
//   createPost,
//   deletePost,
//   updatePost,
//   search,

//   getPostComments,
//   addComment,
//   deleteComment,

//   react,
// };
