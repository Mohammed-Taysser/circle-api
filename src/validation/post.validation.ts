import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';

const isValidYouTubeUrl = (url: string): boolean => {
  const youtubeEmbedRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  return youtubeEmbedRegex.test(url);
};

const reaction = [
  check('react')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('react can not be empty!')
    .bail()
    .isIn(['wow', 'like', 'love', 'star'])
    .withMessage('react should be wow, like, love or star')
    .bail(),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

const createPost = [
  check('visibility')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('visibility can not be empty!')
    .isIn(['public', 'private', 'friends'])
    .withMessage('Visibility should be public, private or friends')
    .bail(),
  check('variant')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('variant can not be empty!')
    .isIn(['blog', 'gallery', 'video', 'audio', 'youtube'])
    .withMessage('Variant should be blog, gallery, video, audio or youtube')
    .custom((value, { req }) => {
      switch (value) {
        case 'video':
          if (!req.files?.video) {
            return Promise.reject(
              "video field is required for the selected variant 'video'"
            );
          }
          break;

        case 'audio':
          if (!req.files?.audio) {
            return Promise.reject(
              "audio field is required for the selected variant 'audio'"
            );
          }
          break;

        case 'gallery':
          if (!req.files?.gallery || !Array.isArray(req.files?.gallery)) {
            return Promise.reject(
              "gallery field is required and should be an array for the selected variant 'gallery'"
            );
          }
          break;

        default:
          break;
      }

      return true;
    })
    .bail(),
  check('youtube').custom((_, { req }) => {
    if (req.body.youtube) {
      return check('youtube')
        .trim()
        .notEmpty()
        .withMessage('youtube field cannot be empty!')
        .custom((value) => {
          if (!isValidYouTubeUrl(value)) {
            return Promise.reject('Invalid YouTube URL in the youtube field');
          }
          return true;
        })
        .bail()
        .run(req);
    }

    return true;
  }),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

export default {
  reaction,
  createPost,
};
