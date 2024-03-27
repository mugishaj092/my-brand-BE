import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage for single file
const upload = multer({ storage });
export const uploadImageMiddleware = upload.single('image');

export default upload;
