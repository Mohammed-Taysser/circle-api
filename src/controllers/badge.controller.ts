import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/badge.schema';
import userSchema from '../schema/user.schema';
import cloudinary from '../utils/cloudinary';
import { calculatePagination } from '../utils/pagination';
import { Badge } from 'types/badge';

async function allBadges(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  const total = await schema.countDocuments();

  await schema
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then((badges) => {
      response.status(statusCode.OK).json({ badges, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function getBadge(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
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

async function getUserBadges(request: Request, response: Response) {
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

async function createBadge(request: Request, response: Response) {
  const { file } = request;

  try {
    const body: Partial<Badge> = {
      label: request.body.label,
      body: request.body.body,
    };

    if (file) {
      body.picture = await cloudinary.badges.uploadPicture(file);
    }

    await new schema(body)
      .save()
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

async function updateBadge(request: Request, response: Response) {
  const { file } = request;
  const { id } = request.params;

  await schema
    .findById(id)
    .then(async (badgeInstance) => {
      if (badgeInstance) {
        try {
          const body: Partial<Badge> = {
            label: request.body.label,
            body: request.body.body,
          };

          if (file) {
            body.picture = await cloudinary.badges.uploadPicture(
              file,
              badgeInstance.picture
            );
          }

          const badge = await schema.findByIdAndUpdate(id, body);

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

async function deleteBadge(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findByIdAndDelete(id)
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

  const total = await schema.countDocuments(queryFilter);

  await schema
    .find(queryFilter)
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
  allBadges,
  getBadge,
  createBadge,
  deleteBadge,
  getUserBadges,
  updateBadge,
  search,
};
