// Common types used across the API

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

export interface User {
  id: string;
  stytch_user_id: string;
  email: string;
  phone_number?: string;
  kyc_status: "pending" | "approved" | "rejected" | "requires_retry";
  kyc_approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface KYCSession {
  id: string;
  user_id: string;
  idv_id: string;
  shareable_url: string;
  status:
    | "pending"
    | "active"
    | "approved"
    | "rejected"
    | "failed"
    | "expired"
    | "canceled";
  plaid_data?: any;
  webhook_history: WebhookEvent[];
  created_at: Date;
  updated_at: Date;
  webhook_received_at?: Date;
}

export interface WebhookEvent {
  webhook_type: string;
  webhook_code: string;
  received_at: Date;
}

export interface FinancialAccount {
  id: string;
  user_id: string;
  account_type: "checking" | "savings";
  account_number: string; // Encrypted
  routing_number: string; // Encrypted
  bank_name: string;
  is_primary: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}
