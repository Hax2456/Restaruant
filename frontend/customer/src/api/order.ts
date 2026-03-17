import request from './request';
import type { ApiResponse, Order, CreateOrderRequest } from '../types';

export const createOrder = (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
  return request.post('/api/customer/orders', data);
};

export const getOrderByNumber = (orderNumber: string): Promise<ApiResponse<Order>> => {
  return request.get(`/api/customer/orders/number/${orderNumber}`);
};
