import request from '../utils/request'
import type { OrderRequest } from '../types'

export const orderApi = {
  listAll: () => request.get('/api/admin/orders'),
  getById: (id: number) => request.get(`/api/admin/orders/${id}`),
  listByStatus: (status: number) => request.get(`/api/admin/orders/status/${status}`),
  listByTable: (tableId: number) => request.get(`/api/admin/orders/table/${tableId}`),
  create: (data: OrderRequest) => request.post('/api/customer/orders', data),
  updateStatus: (id: number, status: number) => request.patch(`/api/admin/orders/${id}/status`, { status }),
  cancel: (id: number) => request.patch(`/api/admin/orders/${id}/cancel`),
  delete: (id: number) => request.delete(`/api/admin/orders/${id}`),
}
