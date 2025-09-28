import type { IEvents } from '../base/Events';
import { IProduct } from '../../types';

class Cart {
  constructor(private readonly events?: IEvents) { }
  cartItems: IProduct[] = [];

  private notifyChange() {
    this.events?.emit('basket:change', {} as any);
  }

  addItem(item: IProduct): void {
    this.cartItems.push(item);
    console.log('Item added to cart:', item);
    this.notifyChange();
  }

  removeItem(id: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.notifyChange();
  }
  clear(): void {
    this.cartItems = [];
    this.notifyChange();
  }
  getTotalPrice(): number {
    const totalPrice = this.cartItems.reduce((total, item) => {
      const price = item.price ?? 0;
      return total + price;
    }, 0);
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
