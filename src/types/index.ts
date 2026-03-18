export interface User {
  username: string;
  token: string;
}

export interface Transaction {
  id: string;
  device_id?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface DeviceLog {
  id?: string;
  device_id?: string;
  timestamp?: string;
  event?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}