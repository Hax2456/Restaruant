import request from './request';
import type { ApiResponse, Dish } from '../types';

export const getCustomerDishes = (): Promise<ApiResponse<Dish[]>> => {
  return request.get('/api/customer/dishes');
};

export const getDishesByCategory = (categoryId: number): Promise<ApiResponse<Dish[]>> => {
  return request.get(`/api/customer/dishes/category/${categoryId}`);
};
