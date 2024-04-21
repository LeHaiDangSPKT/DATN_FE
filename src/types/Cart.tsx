export interface Product {
  avatar: string;
  productId: string;
  productName: string;
  price: number;
  type: string;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  storeId: string;
  storeAvatar: string;
  storeName: string;
  listProducts: Product[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// export interface Cart {
//   data: Product[];
//   store: {
//     _id: string;
//     storeName: string;
//   };
// }

export interface Cart {
  isCheckAll: boolean;
  store: {
    id: string;
    name: string;
    avatar: string;
    isChecked: boolean;
    product: {
      id: string;
      name: string;
      avatar: string;
      type: string;
      oldPrice: number;
      newPrice: number;
      quantity: number;
      quantityInStock: number;
      isChecked: boolean;
    }[];
  }[];
}
