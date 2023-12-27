import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import dayjs from 'dayjs';

const healthCheck = async (request: Request, response: Response) => {
  let greetingPrefix = 'Good morning';

  if (
    parseFloat(dayjs().format('HH')) >= 12 &&
    parseFloat(dayjs().format('HH')) <= 17
  ) {
    greetingPrefix = 'Good afternoon';
  } else if (parseFloat(dayjs().format('HH')) >= 17) {
    greetingPrefix = 'Good evening';
  }

  response.status(statusCode.OK).json({
    greeting: `${greetingPrefix}, Geek`,
    status: 'ok',
    ip: request.ip,
  });
};

export default { healthCheck };
