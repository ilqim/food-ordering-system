export interface Meal {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number;
}