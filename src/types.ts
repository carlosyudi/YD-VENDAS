export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  sale_price: number;
  cost_price: number;
  category?: string;
  stock: number;
  image?: string;
}

export interface Sale {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  sale_price: number;
  cost_price: number;
  total_price: number;
  date: string;
}

export interface Stats {
  today: number;
  week: number;
  month: number;
}
