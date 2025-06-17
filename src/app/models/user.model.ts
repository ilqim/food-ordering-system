export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'restaurant' | 'courier' | 'customer';
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  restaurantName?: string; // Restoran kullanıcıları için
}
