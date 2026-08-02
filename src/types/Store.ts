export interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  completedOrders: number;
  verified: boolean;
  categories: string[];
}
