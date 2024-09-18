export interface User {
  id: string;
  email: string;
  role: string;
  password?: string;
  approved: boolean;
  emailVerified: boolean;
  cart?: Cart;
  orders?: Order[];
  name?: string;
  company?: string;
  vatNumber?: string;
  phoneNumber?: string;
  address?: string;
  discountRate: number;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    color: string;
    retailPrice: number;
    wholesalePrice: number;
    discountPercentage: number;
    discountedPrice: number;
    category: Category;
    categoryId: string;
    subCategory: SubCategory;
    subCategoryId: string;
    brand: Brand;
    brandId: string;
    size: string;
    stock: number;
    imageUrl?: string;
    cartItems: CartItem[];
    orderItems: OrderItem[];
  }
    
  export interface Cart {
    id: string;
    user: User;
    userId: string;
    items: CartItem;
  }

  export interface CartItem {
    id: string;
    cart: Cart;
    cartId: string;
    product: Product;
    productId: string;
    quantity: number;
  }

  export interface Order {
    id: string;
    user: User;
    userId: string;
    items: OrderItem;
    subtotal: number;
    tax: number;
    totalAmount: number;
    status: string;
  }

  export interface OrderItem {
    id: string;
    order: Order;
    orderId: string;
    product: Product;
    productId: string;
    quantity: number;
    price: number;
  }

  export interface FilterState {
    category: string;
    subCategory: string;
    color: string;
    size: string;
    brand: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    search: string;
    minDiscount: string;
    showOnlyAvailable: boolean;
  }

  export interface FilterOptions {
    brands: Brand[];
    categories: Category[];
    colors: string[];
    sizes: string[];
  }

  export interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[];
    products: Product[];
  }

  export interface SubCategory {
    id: string;
    name: string;
    category: Category;
    categoryId: string;
    products: Product[];
  }
  
  export interface Brand {
    id: string;
    name: string;
    products: Product[];
  }

  export type ProductInput = {
    sku: string;
    name: string;
    color: string;
    retailPrice: number;
    wholesalePrice: number;
    discountPercentage: number;
    discountedPrice: number;
    categoryId: string;
    subCategoryId: string;
    brandId: string;
    size: string;
    stock: number;
    imageUrl?: string;
  };
  
  export type ProductFormData = ProductInput;