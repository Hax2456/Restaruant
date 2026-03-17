import request from './request';
import type { ApiResponse, DiningTable, CreateTableRequest } from '../types';

export const getTables = (): Promise<ApiResponse<DiningTable[]>> => {
  return request.get('/api/admin/tables');
};

export const getTablesByStatus = (status: number): Promise<ApiResponse<DiningTable[]>> => {
  return request.get(`/api/admin/tables/status/${status}`);
};

export const createTable = (data: CreateTableRequest): Promise<ApiResponse<DiningTable>> => {
  return request.post('/api/admin/tables', data);
};

export const updateTable = (id: number, data: CreateTableRequest): Promise<ApiResponse<DiningTable>> => {
  return request.put(`/api/admin/tables/${id}`, data);
};

export const deleteTable = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/api/admin/tables/${id}`);
};

export const toggleTableStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return request.patch(`/api/admin/tables/${id}/status`, { status });
};
