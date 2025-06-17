export interface OrderItem {
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  restaurantName: string;
  courierId?: string;
  courierName?: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'onTheWay' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  totalPrice: number;
  orderDate: Date;
  notes?: string;
  paymentMethod?: 'cash' | 'card';
}
