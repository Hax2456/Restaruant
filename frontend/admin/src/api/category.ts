import request from './request';
import type { ApiResponse, Category, CreateCategoryRequest } from '../types';

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
  return request.get('/api/admin/categories');
};

export const createCategory = (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
  return request.post('/api/admin/categories', data);
};

export const updateCategory = (id: number, data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
  return request.put(`/api/admin/categories/${id}`, data);
};

export const deleteCategory = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/api/admin/categories/${id}`);
};

export const toggleCategoryStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return request.patch(`/api/admin/categories/${id}/status`, { status });
};
