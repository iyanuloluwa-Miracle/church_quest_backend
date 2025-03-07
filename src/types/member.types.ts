export interface IMemberRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    churchName: string;
    department: string;
    position?: string;
    dateJoined?: Date;
  }
  
  export interface IMemberResponse {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    churchName: string;
    department: string;
    position: string;
    dateJoined: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IMemberQueryOptions {
    page?: number;
    limit?: number;
    churchName?: string;
    search?: string;
  }
  
  export interface IPaginationResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
  
  export interface IMembersResponse {
    members: IMemberResponse[];
    pagination: IPaginationResponse;
}