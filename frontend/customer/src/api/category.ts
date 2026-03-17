import request from './request';
import type { ApiResponse, Category } from '../types';

export const getCustomerCategories = (): Promise<ApiResponse<Category[]>> => {
  return request.get('/api/customer/categories');
};
