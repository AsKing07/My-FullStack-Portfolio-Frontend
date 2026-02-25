export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T = any > {
success?: boolean;
  message?: string;
   data: {
    items: T;
    pagination?: Pagination;
    // [key: string]: any; 
  };
  user?: any;
  token?: string;
  refreshToken?: string;
}