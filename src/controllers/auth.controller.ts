import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { environment } from '../config/environment';
import { sendSuccess, sendError } from '../utils/response';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { cleanupUpload } from '../utils/upload';
import logger from '../utils/logger';

/**
 * Register new user
 * @route POST /api/auth/signup
 * @access Public
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'User with this email already exists', null, 400);
      return;
    }

    // Create user object
    const userData: Partial<IUser> = {
      name,
      email,
      password,
    };

    // Upload profile picture to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, 'profile-pics');
        userData.profilePic = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        // Clean up uploaded file
        cleanupUpload(req.file.path);
      } catch (error) {
        cleanupUpload(req.file.path);
        logger.error('Profile picture upload error:', error);
        sendError(res, 'Failed to upload profile picture', null, 500);
        return;
      }
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      environment.jwtSecret as jwt.Secret, 
      {
        expiresIn: environment.jwtExpiresIn,
      }
    );

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    };

    sendSuccess(res, 'User registered successfully', { user: userResponse, token }, 201);
  } catch (error) {
    logger.error('Signup error:', error);
    sendError(res, 'Failed to register user', null, 500);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      sendError(res, 'Invalid credentials', null, 401);
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      sendError(res, 'Invalid credentials', null, 401);
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, environment.jwtSecret, {
      expiresIn: environment.jwtExpiresIn,
    });

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    };

    sendSuccess(res, 'User logged in successfully', { user: userResponse, token });
  } catch (error) {
    logger.error('Login error:', error);
    sendError(res, 'Failed to login', null, 500);
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to req object in auth middleware
    const user = req.user;

    sendSuccess(res, 'User profile retrieved successfully', { user });
  } catch (error) {
    logger.error('Get profile error:', error);
    sendError(res, 'Failed to get user profile', null, 500);
  }
};

/**
 * Logout user (token invalidation happens on client-side)
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a stateless JWT setup, the actual token invalidation happens client-side
    // by removing the token from storage
    
    sendSuccess(res, 'User logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    sendError(res, 'Failed to logout', null, 500);
  }
};