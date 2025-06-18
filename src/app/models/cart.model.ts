import { Meal } from "./meal.model";

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  restaurantId?: string;
  restaurantName?: string;
}