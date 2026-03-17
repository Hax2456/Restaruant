import request from './request';
import type { ApiResponse, Order } from '../types';

export const getOrders = (): Promise<ApiResponse<Order[]>> => {
  return request.get('/api/admin/orders');
};

export const getOrdersByStatus = (status: number): Promise<ApiResponse<Order[]>> => {
  return request.get(`/api/admin/orders/status/${status}`);
};

export const updateOrderStatus = (id: number, status: number): Promise<ApiResponse<null>> => {
  return request.patch(`/api/admin/orders/${id}/status`, { status });
};

export const cancelOrder = (id: number): Promise<ApiResponse<null>> => {
  return request.patch(`/api/admin/orders/${id}/cancel`);
};

export const deleteOrder = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/api/admin/orders/${id}`);
};
