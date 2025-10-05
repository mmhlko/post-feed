import { extname } from 'path';

export const filenameGenerator = (
  req,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const name = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${extname(file.originalname)}`;
  cb(null, name);
};
