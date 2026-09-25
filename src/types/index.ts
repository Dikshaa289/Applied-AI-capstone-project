export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  format: string;
  genres: string[];
  price: number;
  delivery: string;
  coverColor: string;
  coverText: string;
  coverBg: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export interface OrderItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  placedAt: string; // ISO date string
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  address: string;
}

export interface Review {
  id: number;
  author: string;
  text: string;
  rating: number;
}
