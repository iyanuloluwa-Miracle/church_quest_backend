import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { 
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember 
} from '../controllers/member.controller';

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
    { field: 'firstName', required: true, type: 'string', minLength: 2, maxLength: 50, in: 'body' },
    { field: 'lastName', required: true, type: 'string', minLength: 2, maxLength: 50, in: 'body' },
    { field: 'email', required: true, type: 'email', in: 'body' },
    { field: 'phone', required: true, type: 'string', minLength: 10, maxLength: 15, in: 'body' },
    { field: 'address', required: true, type: 'string', minLength: 5, maxLength: 200, in: 'body' },
    { field: 'dateOfBirth', required: true, type: 'string', in: 'body' }
  ]),
  createMember
);

/**
 * @route   GET /api/members
 * @desc    Get all members with pagination and filters
 * @access  Private
 */
router.get(
  '/',
  validate([
    { field: 'page', type: 'number', min: 1, in: 'query' },
    { field: 'limit', type: 'number', min: 1, max: 100, in: 'query' }
  ]),
  getMembers
);

/**
 * @route   GET /api/members/:id
 * @desc    Get member by ID
 * @access  Private
 */
router.get(
  '/:id',
  validate([
    { field: 'id', required: true, type: 'string', in: 'params' }
  ]),
  getMemberById
);

/**
 * @route   PUT /api/members/:id
 * @desc    Update member
 * @access  Private
 */
router.put(
  '/:id',
  validate([
    { field: 'id', required: true, type: 'string', in: 'params' },
    { field: 'firstName', type: 'string', minLength: 2, maxLength: 50, in: 'body' },
    { field: 'lastName', type: 'string', minLength: 2, maxLength: 50, in: 'body' },
    { field: 'email', type: 'email', in: 'body' },
    { field: 'phone', type: 'string', minLength: 10, maxLength: 15, in: 'body' },
    { field: 'address', type: 'string', minLength: 5, maxLength: 200, in: 'body' },
    { field: 'dateOfBirth', type: 'string', in: 'body' }
  ]),
  updateMember
);

/**
 * @route   DELETE /api/members/:id
 * @desc    Delete member
 * @access  Private
 */
router.delete(
  '/:id',
  validate([
    { field: 'id', required: true, type: 'string', in: 'params' }
  ]),
  deleteMember
);

export default router;
