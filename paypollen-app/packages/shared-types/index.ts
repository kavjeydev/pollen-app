// Shared types between frontend and backend

export interface User {
  id: string;
  stytch_user_id: string;
  email: string;
  phone_number?: string;
  kyc_status: "pending" | "approved" | "rejected" | "requires_retry";
  kyc_approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  session_token: string;
}

export interface KYCSession {
  idv_id: string;
  status:
    | "pending"
    | "active"
    | "approved"
    | "rejected"
    | "failed"
    | "expired"
    | "canceled";
  shareable_url: string;
  steps?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FinancialAccount {
  id: string;
  user_id: string;
  account_type: "checking" | "savings";
  bank_name: string;
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Note: sensitive fields like account_number are not included in frontend types
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  path: string;
}
