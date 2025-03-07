import { Response } from 'express';

/**
 * Send success response
 * @param res - Express response object
 * @param message - Success message
 * @param data - Response data
 * @param statusCode - HTTP status code
 */
export const sendSuccess = (
  res: Response,
  message: string = 'Success',
  data: any = null,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param error - Error details
 * @param statusCode - HTTP status code
 */
export const sendError = (
  res: Response,
  message: string = 'Error',
  error: any = null,
  statusCode: number = 400
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};