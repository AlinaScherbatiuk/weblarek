import { IApi, IProductsResponse, IOrderRequest, IProduct, IOrderResponse } from '../../types';

class ApiCommunication {

  constructor(private api: IApi) { }

  /**
   * Получить каталог товаров с сервера.
   * GET /product/
   */
  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<IProductsResponse>('/product/');
    return res.items;
  }

  /**
   * Оформить заказ.
   * POST /order/
   */
  async createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    const res = await this.api.post<IOrderResponse>('/order/', payload, 'POST');
    return res;
  }
}
export { ApiCommunication }