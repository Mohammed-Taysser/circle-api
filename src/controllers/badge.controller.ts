import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import service from '../services/badge.services';
import userSchema from '../schema/user.schema';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await service.countDocuments();

  await service
    .all()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then((badges) => {
      response.status(statusCode.OK).json({ badges, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function view(request: Request, response: Response) {
  const { id } = request.params;

  await service
    .getById(id)
    .then((badge) => {
      if (badge) {
        response.status(statusCode.OK).json({ badge });
      } else {
        response.status(statusCode.NOT_FOUND).json({ badge });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function viewUserBadges(request: Request, response: Response) {
  const { id } = request.params;

  await userSchema
    .find({ badges: { $in: [id] } })
    .populate('badges')
    .then((users) => {
      if (users) {
        response.status(statusCode.OK).json({ users });
      } else {
        response.status(statusCode.NOT_FOUND).json({ users });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function create(request: Request, response: Response) {
  const body = { ...request.body };

  try {
    const picture = await cloudinary.uploadAvatar(body.picture.path, 'badges');

    body.picture = picture.secure_url;

    await service
      .save(body)
      .then((badge) => {
        response.status(statusCode.CREATED).json({ badge });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function update(request: Request, response: Response) {
  const { file } = request;
  const { id } = request.params;

  await service
    .getById(id)
    .then(async (badgeInstance) => {
      if (badgeInstance) {
        try {
          const body = { ...request.body };

          if (file) {
            if (badgeInstance.picture) {
              await cloudinary.destroyer(badgeInstance.picture);
            }

            const picture = await cloudinary.uploadAvatar(file.path, 'badges');
            body.picture = picture.secure_url;
          }

          const badge = await service.update(id, body);

          response.status(statusCode.OK).json({ badge });
        } catch (error) {
          console.log(error);
          response.status(statusCode.BAD_REQUEST).json({ error });
        }
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'Badge Not Exist' });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function deleteItem(request: Request, response: Response) {
  const { id } = request.params;

  await service
    .delete(id)
    .then(async (badge) => {
      if (badge) {
        response.status(statusCode.OK).json({ badge });
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'badge not exist' });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function search(request: Request, response: Response) {
  const pagination = calculatePagination(request);
  const searchQuery = request.query.query ?? '';

  let sort = '-createAt';

  switch (request.query.sort) {
    case 'a-z':
      sort = 'label';
      break;
    case 'z-a':
      sort = '-label';
      break;
    case 'latest':
      sort = '-createdAt';
      break;
    case 'oldest':
      sort = 'createdAt';
      break;
  }

  const queryFilter = {
    $or: [{ label: { $regex: searchQuery, $options: 'i' } }],
  };

  const total = await service.countDocuments(queryFilter);

  await service
    .filter(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .then((badges) => {
      response.status(statusCode.OK).json({ badges, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default {
  all,
  view,
  create,
  delete: deleteItem,
  viewUserBadges,
  update,
  search,
};
