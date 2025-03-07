import { v2 as cloudinary } from 'cloudinary';
import { environment } from './environment';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: environment.cloudinary.cloudName,
  api_key: environment.cloudinary.apiKey,
  api_secret: environment.cloudinary.apiSecret,
});

/**
 * Upload file to Cloudinary
 * @param filePath - Path to the file to upload
 * @param folder - Folder to upload the file to
 * @returns Cloudinary upload result
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'profile-pics'
): Promise<cloudinary.UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @returns Cloudinary deletion result
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<cloudinary.DeleteApiResponse> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('File deletion failed');
  }
};

export default cloudinary;