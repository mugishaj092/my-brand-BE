import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage} from 'multer-storage-cloudinary';

interface Folders {
    folder: string;
}

interface CustomParams extends Folders {}
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'MYBRAND',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    } as CustomParams, 
});

export default storage;