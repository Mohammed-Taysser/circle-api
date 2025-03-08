import express, { Request, Response } from 'express';
import statusCode from 'http-status-codes';

const router = express.Router();

type Template = 'verify-email';

function renderTemplate(template: Template) {
  return (req: Request, res: Response) => {
    res
      .status(statusCode.OK)
      .render(template, { verificationLink: `#${template}` });
  };
}

router.get('/verify-email', renderTemplate('verify-email'));

export default router;
