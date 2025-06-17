export interface Meal {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
  available?: boolean;
}