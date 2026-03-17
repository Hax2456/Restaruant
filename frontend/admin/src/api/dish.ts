import request from './request';
import type { ApiResponse, Dish, CreateDishRequest } from '../types';

export const getDishes = (): Promise<ApiResponse<Dish[]>> => {
  return request.get('/api/admin/dishes');
};

export const createDish = (data: CreateDishRequest): Promise<ApiResponse<Dish>> => {
  return request.post('/api/admin/dishes', data);
};

export const updateDish = (id: number, data: CreateDishRequest): Promise<ApiResponse<Dish>> => {
  return request.put(`/api/admin/dishes/${id}`, data);
};

export const deleteDish = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/api/admin/dishes/${id}`);
};

export const toggleDishStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return request.patch(`/api/admin/dishes/${id}/status`, { status });
};
