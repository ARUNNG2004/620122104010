import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      body: req.body,
      time: `${Date.now() - start}ms`
    };
    fs.appendFileSync(
      path.join(__dirname, '../logs.txt'),
      JSON.stringify(log) + '\n'
    );
  });
  next();
};
