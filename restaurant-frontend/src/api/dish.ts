import request from '../utils/request'

export const dishApi = {
  listAll: () => request.get('/api/admin/dishes'),
  getById: (id: number) => request.get(`/api/admin/dishes/${id}`),
  listByCategory: (categoryId: number) => request.get(`/api/admin/dishes/category/${categoryId}`),
  create: (data: object) => request.post('/api/admin/dishes', data),
  update: (id: number, data: object) => request.put(`/api/admin/dishes/${id}`, data),
  delete: (id: number) => request.delete(`/api/admin/dishes/${id}`),
  updateStatus: (id: number, status: number) => request.patch(`/api/admin/dishes/${id}/status`, { status }),
}
