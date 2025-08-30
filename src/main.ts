import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiCommunication } from './components/Models/ApiCommunication';
import { API_URL } from './utils/constants';


const productsModel = new ProductCatalog(apiProducts.items);

//  Получение всего массива товаров
console.log('Массив товаров из каталога:', productsModel.getArrayProducts());

//  Получение одного товара по ID
const firstId = apiProducts.items[0]?.id;
console.log('Первый товар по ID:', firstId, productsModel.getProduct(firstId));

// Проверка setArrayProducts (переустановим данные и проверим)
productsModel.setArrayProducts(apiProducts.items);
console.log('Каталог после повторной установки массива:', productsModel.getArrayProducts());



const cartModel = new Cart();
// Добавление двух товаров
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Корзина после добавления:', cartModel.getCartItems());

// Общая сумма
console.log('Общая сумма корзины:', cartModel.getTotalPrice());

//  Проверка наличия второго товара по ID
console.log(
    `Товар с ID ${apiProducts.items[1].id} в корзине?`,
    cartModel.isItemInCart(apiProducts.items[1].id)
);

//  Удаление первого товара и повторная проверка
cartModel.removeItem(apiProducts.items[0].id);
console.log('Корзина после удаления первого товара:', cartModel.getCartItems());
console.log('Общая сумма после удаления:', cartModel.getTotalPrice());
console.log(
    `Товар с ID ${apiProducts.items[0].id} в корзине?`,
    cartModel.isItemInCart(apiProducts.items[0].id)
);


// Создание покупателя и получение данных
const buyer = new Buyer('card', 'test@mail.com', '89999999999', 'Москва, ул. Пушкина, д.1');
console.log('Данные покупателя (getDetails):', buyer.getDetails());

//  Валидация данных
console.log('Валидация данных (validate):', buyer.validate());

//  Очистка данных и повторная проверка
buyer.clearBuyerData();
console.log('Данные после очистки:', buyer.getDetails());
console.log('Валидация после очистки:', buyer.validate());



//Загрузка каталога с сервера
const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });

const service = new ApiCommunication(api);


const items = await service.getProducts();
console.log('Каталог товаров с сервера:', items);

const products = new ProductCatalog(items);
console.log('Массив товаров из модели:', products.getArrayProducts());