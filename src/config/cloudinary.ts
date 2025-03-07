import { v2 as cloudinary } from 'cloudinary';
import { environment } from './environment';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: environment.cloudinary.cloudName,
  api_key: environment.cloudinary.apiKey,
  api_secret: environment.cloudinary.apiSecret,
});

interface UploadApiResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

interface DeleteApiResponse {
  result: string;
}

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'profile-pics'
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return result as UploadApiResponse;
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<DeleteApiResponse> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result as DeleteApiResponse;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('File deletion failed');
  }
};

export default cloudinary;