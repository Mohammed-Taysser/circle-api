import multer from 'multer';

class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean; // is the error operational (as opposed to a programming error)?
  public message: string;

  constructor(error: string | Error, statusCode = 400) {
    const message = error instanceof Error ? error.message : error;
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);

    if (error instanceof multer.MulterError) {
      this.message = error.message;
    }
  }
}

export default AppError;
