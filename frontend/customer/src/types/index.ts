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
  price: number;
  images: string;
  image?: string;
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

export interface CreateOrderRequest {
  tableId: number;
  remark: string;
  items: {
    dishId: number;
    quantity: number;
    remark: string;
  }[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  remark: string;
}

export type CartAction =
  | { type: 'ADD_ITEM'; dish: Dish }
  | { type: 'REMOVE_ITEM'; dishId: number }
  | { type: 'UPDATE_QUANTITY'; dishId: number; quantity: number }
  | { type: 'UPDATE_REMARK'; dishId: number; remark: string }
  | { type: 'CLEAR_CART' };

export interface CartState {
  items: CartItem[];
}
