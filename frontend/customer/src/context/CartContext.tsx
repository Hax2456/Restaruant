import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartState, CartAction, CartItem, Dish } from '../types';

const CART_STORAGE_KEY = 'restaurant_cart';

const initialState: CartState = {
  items: [],
};

function loadCartFromStorage(): CartState {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse errors
  }
  return initialState;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.dish.id === action.dish.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.dish.id === action.dish.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      const newItem: CartItem = { dish: action.dish, quantity: 1, remark: '' };
      return { ...state, items: [...state.items, newItem] };
    }
    case 'REMOVE_ITEM': {
      const existing = state.items.find((item) => item.dish.id === action.dishId);
      if (!existing) return state;
      if (existing.quantity <= 1) {
        return { ...state, items: state.items.filter((item) => item.dish.id !== action.dishId) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.dish.id === action.dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.dish.id !== action.dishId) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.dish.id === action.dishId ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case 'UPDATE_REMARK': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.dish.id === action.dishId ? { ...item, remark: action.remark } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalAmount: number;
  addItem: (dish: Dish) => void;
  removeItem: (dishId: number) => void;
  getItemQuantity: (dishId: number) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  const addItem = (dish: Dish) => dispatch({ type: 'ADD_ITEM', dish });
  const removeItem = (dishId: number) => dispatch({ type: 'REMOVE_ITEM', dishId });
  const getItemQuantity = (dishId: number) => {
    const item = state.items.find((i) => i.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalAmount, addItem, removeItem, getItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
