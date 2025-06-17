export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'restaurant' | 'courier' | 'customer';
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  restaurantName?: string;
}