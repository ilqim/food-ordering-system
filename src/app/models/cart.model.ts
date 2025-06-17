import { Meal } from './meal.model';

export interface CartItem {
  meal: Meal;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  userId: string;
  restaurantId?: string;
  restaurantName?: string;
  items: CartItem[];
  totalPrice: number;
}