import { Types } from 'mongoose';
import { Member, IMember } from '../models/member.model';
import { 
  IMemberRequest, 
  IMemberResponse, 
  IMemberQueryOptions,
  IMembersResponse
} from '../types';
import logger from '../utils/logger';

/**
 * Create a new member
 * @param memberData - Member data
 * @param userId - User ID who is creating the member
 * @returns Created member
 */
export const createNewMember = async (
  memberData: IMemberRequest,
  userId: Types.ObjectId | string
): Promise<IMemberResponse> => {
  // Create member data object
  const memberObj: Partial<IMember> = {
    ...memberData,
    position: memberData.position || 'Member',
    dateJoined: memberData.dateJoined || new Date(),
    createdBy: new Types.ObjectId(userId),
  };

  // Create new member
  const member = await Member.create(memberObj);

  return member.toObject();
};

/**
 * Get members with pagination and filters
 * @param userId - User ID
 * @param options - Query options (page, limit, filters)
 * @returns Members list with pagination
 */
export const getFilteredMembers = async (
  userId: Types.ObjectId | string,
  options: IMemberQueryOptions
): Promise<IMembersResponse> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = { createdBy: userId };
  
  // Add churchName filter if provided
  if (options.churchName) {
    query.churchName = options.churchName;
  }

  // Add search filter if provided
  if (options.search) {
    query.$text = { $search: options.search };
  }

  // Get total count
  const total = await Member.countDocuments(query);

  // Get members
  const members = await Member.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    members: members.map(member => member.toObject()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get member by ID
 * @param memberId - Member ID
 * @param userId - User ID
 * @returns Member or null if not found
 */
export const getMemberDetails = async (
  memberId: string,
  userId: Types.ObjectId | string
): Promise<IMemberResponse | null> => {
  const member = await Member.findOne({
    _id: memberId,
    createdBy: userId,
  });

  return member ? member.toObject() : null;
};

/**
 * Update member
 * @param memberId - Member ID
 * @param userId - User ID
 * @param updateData - Data to update
 * @returns Updated member or null if not found
 */
export const updateMemberDetails = async (
  memberId: string,
  userId: Types.ObjectId | string,
  updateData: Partial<IMemberRequest>
): Promise<IMemberResponse | null> => {
  const member = await Member.findOneAndUpdate(
    { _id: memberId, createdBy: userId },
    { $set: updateData },
    { new: true }
  );

  return member ? member.toObject() : null;
};

/**
 * Delete member
 * @param memberId - Member ID
 * @param userId - User ID
 * @returns True if deleted, false if not found
 */
export const deleteMember = async (
  memberId: string,
  userId: Types.ObjectId | string
): Promise<boolean> => {
  const result = await Member.deleteOne({
    _id: memberId,
    createdBy: userId,
  });

  return result.deletedCount > 0;
};