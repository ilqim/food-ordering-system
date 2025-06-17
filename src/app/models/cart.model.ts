export interface CartItem {
  mealId: string;
  mealName: string;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  restaurantId?: string; // Tüm ürünler aynı restorandan olmalı
}