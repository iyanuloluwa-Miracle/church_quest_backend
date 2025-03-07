import express from 'express';
import { body, param, query } from 'express-validator';
import * as memberController from '../controllers/member.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

// All member routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/members
 * @desc    Create new member
 * @access  Private
 */
router.post(
  '/',
  validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    body('churchName')
      .trim()
      .notEmpty()
      .withMessage('Church name is required'),
    body('department')
      .trim()
      .notEmpty()
      .withMessage('Department is required'),
  ]),
  memberController.createMember
);

/**
 * @route   GET /api/members
 * @desc    Get all members with pagination and filters
 * @access  Private
 */
router.get(
  '/',
  validate([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ]),
  memberController.getMembers
);

/**
 * @route   GET /api/members/:id
 * @desc    Get member by ID
 * @access  Private
 */
router.get(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid member ID'),
  ]),
  memberController.getMemberById
);

/**
 * @route   PUT /api/members/:id
 * @desc    Update member
 * @access  Private
 */
router.put(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid member ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email'),
  ]),
  memberController.updateMember
);

/**
 * @route   DELETE /api/members/:id
 * @desc    Delete member
 * @access  Private
 */
router.delete(
  '/:id',
  validate([
    param('id')
      .isMongoId()
      .withMessage('Invalid member ID'),
  ]),
  memberController.deleteMember
);

export default router;