import mongoose, { Document, Schema } from 'mongoose';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  churchName: string;
  department: string;
  position: string;
  dateJoined: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    churchName: {
      type: String,
      required: [true, 'Church name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    position: {
      type: String,
      default: 'Member',
      trim: true,
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search functionality
memberSchema.index({ 
  name: 'text', 
  email: 'text', 
  department: 'text', 
  position: 'text',
  churchName: 'text'
});

export const Member = mongoose.model<IMember>('Member', memberSchema);