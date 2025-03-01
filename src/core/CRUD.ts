import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { Model, Document } from 'mongoose';
import { calculatePagination } from '../utils/pagination';

interface CRUDOptions<T> {
  simpleFields?: (keyof T)[];
  populateFields?: (keyof T)[];
}

class CrudService<T extends Document> {
  protected model: Model<T>;
  protected simpleFields: (keyof T)[] = ['_id'];
  protected populateFields: (keyof T)[] = [];

  constructor(model: Model<T>, options?: CRUDOptions<T>) {
    const { simpleFields = [], populateFields = [] } = options || {};

    this.simpleFields = simpleFields;
    this.populateFields = populateFields;

    this.model = model;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(request: Request, response: Response) {
    const pagination = calculatePagination(request);

    const isSimple = request.query.simple === 'true';

    const total = await this.model.countDocuments();

    const projection = isSimple
      ? this.simpleFields.reduce(
          (prev, current) => ({ ...prev, [current]: 1, _id: 1 }),
          {}
        )
      : {};

    await this.model
      .find({}, projection)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate(this.populateFields as string[])
      .then((items) => {
        response
          .status(statusCode.OK)
          .json({ meta: { ...pagination, total }, data: items });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async getById(request: Request, response: Response) {
    const { id } = request.params;

    await this.model
      .findById(id)
      .populate(this.populateFields as string[])
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async create(request: Request, response: Response) {
    await new this.model(request.body)
      .save()
      .then((item) => {
        response.status(statusCode.CREATED).json({ data: item });
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    await this.model
      .findByIdAndUpdate(id, request.body, { runValidators: true, new: true })
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await this.model
      .findByIdAndDelete(id)
      .then((item) => {
        if (item) {
          response.status(statusCode.OK).json({ data: item });
        } else {
          response
            .status(statusCode.NOT_FOUND)
            .json({ error: 'Item not found' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  }
}

export default CrudService;
