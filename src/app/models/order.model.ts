export interface OrderItem {
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
  totalPrice: number;
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
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  totalPrice: number;
  orderDate: Date;
  deliveryTime?: Date;
  notes?: string;
  paymentMethod: 'cash' | 'card';
}