import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { environment } from '../config/environment';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { ISignupRequest, ILoginRequest, IAuthResponse, IUserResponse } from '../types';
import logger from '../utils/logger';

/**
 * Register a new user
 * @param userData - User registration data
 * @param profilePicPath - Path to uploaded profile picture (optional)
 * @returns Auth response with user info and token
 */
export const signupUser = async (
  userData: ISignupRequest,
  profilePicPath?: string
): Promise<IAuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create user object
  const userObj: Partial<IUser> = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  };

  // Upload profile picture to Cloudinary if provided
  if (profilePicPath) {
    try {
      const result = await uploadToCloudinary(profilePicPath, 'profile-pics');
      userObj.profilePic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error('Profile picture upload error:', error);
      throw new Error('Failed to upload profile picture');
    }
  }

  // Create new user
  const user = await User.create(userObj);

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user data (excluding password)
  const userResponse = mapUserToResponse(user);

  return { user: userResponse, token };
};

/**
 * Login a user
 * @param loginData - User login data
 * @returns Auth response with user info and token
 */
export const loginUser = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
  // Find user by email
  const user = await User.findOne({ email: loginData.email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(loginData.password);
  
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user data (excluding password)
  const userResponse = mapUserToResponse(user);

  return { user: userResponse, token };
};

/**
 * Generate JWT token
 * @param userId - User ID
 * @returns JWT token
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, environment.jwtSecret, {
    expiresIn: environment.jwtExpiresIn,
  });
};

/**
 * Map user model to response object
 * @param user - User model
 * @returns User response object
 */
export const mapUserToResponse = (user: IUser): IUserResponse => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    createdAt: user.createdAt,
  };
};