export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Ответ сервера на GET /product/
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}
 
// Ответ сервера на POST /order/
export interface IOrderResponse {
  id: string;             // номер заказа
  total: number;          // финальная сумма
}
// Запрос на POST /order/
export interface IOrderRequest {
  items: string[];     // массив id товаров 
}

// Интерфейс для товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс для покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Тип для способа оплаты
export type TPayment = "card" | "cash" | "";
