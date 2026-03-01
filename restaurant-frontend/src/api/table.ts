import request from '../utils/request'

export const tableApi = {
  listAll: () => request.get('/api/admin/tables'),
  getById: (id: number) => request.get(`/api/admin/tables/${id}`),
  listByStatus: (status: number) => request.get(`/api/admin/tables/status/${status}`),
  create: (data: { tableNumber: string; seats: number }) => request.post('/api/admin/tables', data),
  update: (id: number, data: { tableNumber: string; seats: number }) => request.put(`/api/admin/tables/${id}`, data),
  updateStatus: (id: number, status: number) => request.patch(`/api/admin/tables/${id}/status`, { status }),
  delete: (id: number) => request.delete(`/api/admin/tables/${id}`),
}
