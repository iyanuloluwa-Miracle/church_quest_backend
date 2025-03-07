import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import logger from '../utils/logger';
import * as memberService from '../services/member.service';

/**
 * Create new member
 * @route POST /api/members
 * @access Private
 */
export const createMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await memberService.createNewMember(req.body, req.user._id);
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
    const churchName = req.query.churchName as string;
    const search = req.query.search as string;

    const result = await memberService.getFilteredMembers(req.user._id, {
      page,
      limit,
      churchName,
      search,
    });

    sendSuccess(res, 'Members retrieved successfully', result);
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
    const member = await memberService.getMemberDetails(memberId, req.user._id);

    if (!member) {
      sendError(res, 'Member not found', null, 404);
      return;
    }

    sendSuccess(res, 'Member retrieved successfully', { member });
  } catch (error) {
    logger.error('Get member by ID error:', error);
    sendError(res, 'Failed to get member', null, 500);
  }
};

/**
 * Update member
 * @route PUT /api/members/:id
 * @access Private
 */
export const updateMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberId = req.params.id;
    const updateData = req.body;
    
    const updatedMember = await memberService.updateMemberDetails(
      memberId,
      req.user._id,
      updateData
    );

    if (!updatedMember) {
      sendError(res, 'Member not found', null, 404);
      return;
    }

    sendSuccess(res, 'Member updated successfully', { member: updatedMember });
  } catch (error) {
    logger.error('Update member error:', error);
    sendError(res, 'Failed to update member', null, 500);
  }
};

/**
 * Delete member
 * @route DELETE /api/members/:id
 * @access Private
 */
export const deleteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberId = req.params.id;
    const deleted = await memberService.deleteMember(memberId, req.user._id);

    if (!deleted) {
      sendError(res, 'Member not found', null, 404);
      return;
    }

    sendSuccess(res, 'Member deleted successfully');
  } catch (error) {
    logger.error('Delete member error:', error);
    sendError(res, 'Failed to delete member', null, 500);
  }
};