import { Request, Response } from 'express';
import { Member, IMember } from '../models/member.model';
import { sendSuccess, sendError } from '../utils/response';
import logger from '../utils/logger';

/**
 * Create new member
 * @route POST /api/members
 * @access Private
 */
export const createMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      address,
      churchName,
      department,
      position,
      dateJoined,
    } = req.body;

    // Create new member
    const memberData: Partial<IMember> = {
      name,
      email,
      phone,
      address,
      churchName,
      department,
      position: position || 'Member',
      dateJoined: dateJoined || new Date(),
      createdBy: req.user._id,
    };

    const member = await Member.create(memberData);

    sendSuccess(res, 'Member created successfully', { member }, 201);
  } catch (error) {
    logger.error('Create member error:', error);
    sendError(res, 'Failed to create member', null, 500);
  }
};

/**
 * Get all members with pagination and filters
 * @route GET /api/members
 * @access Private
 */
export const getMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const churchName = req.query.churchName as string;
    const search = req.query.search as string;

    // Build query
    const query: any = { createdBy: req.user._id };
    
    // Add churchName filter if provided
    if (churchName) {
      query.churchName = churchName;
    }

    // Add search filter if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count
    const total = await Member.countDocuments(query);

    // Get members
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendSuccess(res, 'Members retrieved successfully', {
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get members error:', error);
    sendError(res, 'Failed to get members', null, 500);
  }
};

/**
 * Get member by ID
 * @route GET /api/members/:id
 * @access Private
 */
export const getMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberId = req.params.id;

    // Find member by ID
    const member = await Member.findOne({
      _id: memberId,
      createdBy: req.user._id,
);