import { Types, Document } from 'mongoose';
import { Member, IMember } from '../models/member.model';
import { 
  IMemberRequest, 
  IMemberResponse, 
  IMemberQueryOptions,
  IMembersResponse
} from '../types';
import logger from '../utils/logger';

const toMemberResponse = (member: IMember & Document): IMemberResponse => ({
  _id: member._id.toString(),
  name: member.name,
  email: member.email,
  phone: member.phone,
  address: member.address,
  churchName: member.churchName,
  department: member.department,
  position: member.position,
  dateJoined: member.dateJoined,
  createdBy: member.createdBy.toString(),
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
});

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
  const member = await Member.create({
    ...memberData,
    createdBy: new Types.ObjectId(userId),
  });

  return toMemberResponse(member);
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
  const { page = 1, limit = 10, churchName, search } = options;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = { createdBy: new Types.ObjectId(userId) };
  if (churchName) {
    query.churchName = churchName;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const [members, total] = await Promise.all([
    Member.find(query).skip(skip).limit(limit),
    Member.countDocuments(query),
  ]);

  const pages = Math.ceil(total / limit);

  return {
    members: members.map(toMemberResponse),
    pagination: {
      page,
      limit,
      total,
      pages,
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
    _id: new Types.ObjectId(memberId),
    createdBy: new Types.ObjectId(userId),
  });

  return member ? toMemberResponse(member) : null;
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
    {
      _id: new Types.ObjectId(memberId),
      createdBy: new Types.ObjectId(userId),
    },
    { $set: updateData },
    { new: true }
  );

  return member ? toMemberResponse(member) : null;
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
    _id: new Types.ObjectId(memberId),
    createdBy: new Types.ObjectId(userId),
  });

  return result.deletedCount > 0;
};