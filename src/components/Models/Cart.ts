
import { IProduct } from '../../types';

class Cart {
  cartItems: IProduct[] = [];
 
  addItem(item: IProduct): void {
    this.cartItems.push(item);
    console.log('Item added to cart:', item);
  }

  removeItem(id: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
  }

  getTotalPrice(): number {
    const totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    return totalPrice;
  }

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  isItemInCart(id: string): boolean {
    const isInCart = this.cartItems.some(item => item.id === id);
    return isInCart;
  }
}

export { Cart };
