export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface Category {
  id: number
  name: string
  sort: number
  status: number
  createTime: string
  upDateTime: string
}

export interface Dish {
  id: number
  name: string
  categoryId: number
  price: number
  images: string
  description: string
  status: number
  createTime: string
  upDateTime: string
}

export interface DiningTable {
  id: number
  tableNumber: string
  seats: number
  status: number
  qrCode: string
  createTime: string
  updateTime: string
}

export interface OrderItem {
  id: number
  orderId: number
  dishId: number
  dishName: string
  dishPrice: number
  quantity: number
  remark: string
  subtotal: number
  createTime: string
}

export interface Order {
  id: number
  orderNumber: string
  tableId: number
  totalAmount: number
  status: number
  remark: string
  createTime: string
  upDateTime: string
  orderItems: OrderItem[]
}

export interface OrderItemRequest {
  dishId: number
  quantity: number
  remark?: string
}

export interface OrderRequest {
  tableId: number
  remark?: string
  items: OrderItemRequest[]
}
