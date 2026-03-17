import request from './request';
import type { ApiResponse, DiningTable } from '../types';

export const getAvailableTables = (): Promise<ApiResponse<DiningTable[]>> => {
  return request.get('/api/admin/tables/status/1');
};

export const getAllTables = (): Promise<ApiResponse<DiningTable[]>> => {
  return request.get('/api/admin/tables');
};
