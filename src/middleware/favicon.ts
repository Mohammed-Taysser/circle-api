import path from 'path';
import serveFavicon from 'serve-favicon';

const faviconMiddleware = serveFavicon(
  path.join(path.resolve('./'), 'public', 'favicon.png')
);

export default faviconMiddleware;
