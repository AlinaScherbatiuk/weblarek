
import { IProduct } from '../../types';

class ProductCatalog {
  arrayProducts: IProduct[] = [];

  constructor(initialProducts: IProduct[]) {
    this.arrayProducts = initialProducts;
  }

  setArrayProducts(arrayProducts: IProduct[]): void {
    this.arrayProducts = arrayProducts;
  }

  getArrayProducts(): IProduct[] {
    return this.arrayProducts;
  }

  getProduct(id: string): IProduct | undefined {
    const product = this.arrayProducts.find(product => product.id === id);
    return product;
  }
}

export { ProductCatalog };
