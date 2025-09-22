import './scss/styles.scss';

 
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

 import { Api } from './components/base/Api';
import { ApiCommunication } from './components/Models/ApiCommunication';
import { API_URL, CDN_URL } from './utils/constants';

import { events } from './components/base/eventsBus';
import { OverlayDialog } from './components/View/OverlayDialog';
import { CartToggleButton } from './components/View/CartToggleButton';
import { ProductGrid } from './components/View/ProductGrid';
import { CartPanel } from './components/View/CartPanel';
import { ProductQuicklook } from './components/View/ProductQuicklook';
import { CheckoutDetailsStep } from './components/View/CheckoutDetailsStep';
import { CheckoutContactsStep } from './components/View/CheckoutContactsStep';

import type { IProduct, ProductId, IOrderRequest } from './types';

const productsModel = new ProductCatalog([]);
const cartModel = new Cart();
const buyerModel = new Buyer('', '', '', '');

const modalView = new OverlayDialog(events);
const headerCart = new CartToggleButton(events);
const catalog = new ProductGrid(events);
const catalogView = new CartPanel(events);
const orderStep1View = new CheckoutDetailsStep(events);
const orderStep2View = new CheckoutContactsStep(events);

document.querySelector('.header__basket')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  events.emit('basket/open', {});
});

function renderCatalog() {
  const items = productsModel.getArrayProducts().map((p: IProduct) => ({
    id: p.id,
    title: p.title,
    image: p.image ? `${CDN_URL}/${p.image}` : undefined,
    price: p.price,
  inBasket: cartModel.isItemInCart(p.id),
  category: p.category,
  }));
  catalog.setState({ items });
  headerCart.setState({ count: cartModel.getCartItems().length });
}

function openBasket() {
  catalogView.setState({
    items: cartModel.getCartItems().map((it, index) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      index,
    })),
    total: cartModel.getTotalPrice(),
  });
  modalView.open(catalogView.render());
}

events.on<{ id: ProductId }>('product/open', ({ id }) => {
  const item = productsModel.getProduct(id);
  if (!item) return;

  const preview = new ProductQuicklook(events, {
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image ? `${CDN_URL}/${item.image}` : undefined,
    price: item.price,
    inBasket: cartModel.isItemInCart(item.id),
    category: item.category,
  });
  modalView.open(preview.getElement());
});

events.on<{ id: ProductId }>('product/add', ({ id }) => {
  const item = productsModel.getProduct(id);
  if (!item) return;
  if (!cartModel.isItemInCart(id)) {
    cartModel.addItem(item);
  }
  headerCart.setState({ count: cartModel.getCartItems().length });
events.on<{ id: ProductId }>('product/remove', ({ id }) => {
  if (cartModel.isItemInCart(id)) {
    cartModel.removeItem(id);
  }
  headerCart.setState({ count: cartModel.getCartItems().length });
  events.emit('basket:changed', { items: cartModel.getCartItems(), total: cartModel.getTotalPrice() });
});

  events.emit('basket:changed', { items: cartModel.getCartItems(), total: cartModel.getTotalPrice() });
});

events.on('basket/open', () => openBasket());

events.on<{ id: ProductId }>('basket/remove', ({ id }) => {
  cartModel.removeItem(id);
  headerCart.setState({ count: cartModel.getCartItems().length });
  events.emit('basket:changed', { items: cartModel.getCartItems(), total: cartModel.getTotalPrice() });
});
 
events.on('basket/checkout', () => {
  modalView.open(orderStep1View.render());
});

events.on<{ data: { payment: 'card' | 'cash'; address: string } }>('order/step1/next', ({ data }) => {
  buyerModel.setBuyerData({ payment: data.payment });
  buyerModel.setBuyerData({ address: data.address });
  modalView.open(orderStep2View.render());
});

events.on<{ data: { email: string; phone: string } }>('order/step2/pay', async ({ data }) => {
  buyerModel.setBuyerData({ email: data.email });
  buyerModel.setBuyerData({ phone: data.phone });
  if (!buyerModel.validate()) return;

  const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
  const service = new ApiCommunication(api);

  const payload: IOrderRequest = {
    payment: buyerModel.payment,
    address: buyerModel.address,
    email: buyerModel.email,
    phone: buyerModel.phone,
    items: cartModel.getCartItems().map((it) => it.id),
    total: cartModel.getTotalPrice(),
  };

  try {
    await service.createOrder(payload);
const tpl = document.getElementById('success') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const amountEl = node.querySelector('.order-success__description') as HTMLElement;
  if (amountEl) amountEl.textContent = `Списано ${cartModel.getTotalPrice()} синапсов`;
  const closeBtn = node.querySelector('.order-success__close') as HTMLButtonElement;
  if (closeBtn) closeBtn.addEventListener('click', () => modalView.close());
  modalView.open(node);

    cartModel.cartItems = [];
    headerCart.setState({ count: 0 });
  } catch (e) {
    console.error('Не удалось оформить заказ:', e);
  }
});


(async () => {
  try {
    const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
    const service = new ApiCommunication(api);
    const items = await service.getProducts();
    productsModel.setArrayProducts(items);
    renderCatalog();
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
})();