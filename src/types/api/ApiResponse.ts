export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
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