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
  status: 'pending' | 'inProgress' | 'readyForDelivery' | 'onTheWay' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  totalPrice: number;
  orderDate: Date;
  notes?: string;
  paymentType: 'cash' | 'card';
}
