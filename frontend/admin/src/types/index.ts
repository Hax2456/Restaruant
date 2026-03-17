export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Category {
  id: number;
  name: string;
  sort: number;
  status: number;
}

export interface Dish {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  images: string;
  description: string;
  status: number;
  sort: number;
}

export interface DiningTable {
  id: number;
  tableNumber: string;
  seats: number;
  status: number;
  qrCode?: string;
  createTime?: string;
}

export interface OrderItem {
  dishId: number;
  dishName?: string;
  quantity: number;
  price?: number;
  remark?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableNumber?: string;
  totalAmount: number;
  status: number;
  remark?: string;
  createTime: string;
  upDateTime?: string;
  orderItems?: OrderItem[];
}

export interface CreateCategoryRequest {
  name: string;
  sort: number;
  status: number;
}

export interface CreateDishRequest {
  name: string;
  categoryId: number;
  price: number;
  images: string;
  description: string;
}

export interface CreateTableRequest {
  tableNumber: string;
  seats: number;
}
