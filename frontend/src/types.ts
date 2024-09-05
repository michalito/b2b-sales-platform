export interface Product {
    id: string;
    sku: string;
    name: string;
    color: string;
    retailPrice: number;
    wholesalePrice: number;
    discountPercentage: number;
    category: string;
    subCategory: string;
    size: string;
    stock: number;
    imageUrl?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    role: string;
    discountRate: number;
    name: string;
  }
  
  export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
  }