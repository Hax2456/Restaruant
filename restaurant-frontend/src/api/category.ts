import request from '../utils/request'
import type { Category } from '../types'

export const categoryApi = {
  listAll: () => request.get<any, { data: { data: Category[] } }>('/api/admin/categories'),
  getById: (id: number) => request.get(`/api/admin/categories/${id}`),
  create: (data: { name: string; sort: number }) => request.post('/api/admin/categories', data),
  update: (id: number, data: { name: string; sort: number }) => request.put(`/api/admin/categories/${id}`, data),
  delete: (id: number) => request.delete(`/api/admin/categories/${id}`),
  updateStatus: (id: number, status: number) => request.patch(`/api/admin/categories/${id}/status`, { status }),
}
