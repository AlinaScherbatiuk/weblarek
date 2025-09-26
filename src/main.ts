import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ensureElement } from './utils/utils';
import { Api } from './components/base/Api';
import { ApiCommunication } from './components/Models/ApiCommunication';
import { API_URL, CDN_URL } from './utils/constants';
import { BasketLine } from './components/View/BasketLine';
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
const cartModel = new Cart(events);
const buyerModel = new Buyer('', '', '', '', events);

const api = new Api(API_URL, { headers: { 'Content-Type': 'application/json' } });
const service = new ApiCommunication(api);

const modalView = new OverlayDialog(events);
const headerCart = new CartToggleButton(events);
const catalog = new ProductGrid(events);
const catalogView = new CartPanel(events);
const orderStep1View = new CheckoutDetailsStep(events);
const orderStep2View = new CheckoutContactsStep(events);

let currentPreview: ProductQuicklook | null = null;
let currentPreviewId: ProductId | null = null;

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
  headerCart.setCount(cartModel.getCartItems().length);
}

function openBasket() {
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

  currentPreview = preview;
  currentPreviewId = item.id;
  modalView.open(preview.getElement());
});

events.on<{ id: ProductId }>('product/add', ({ id }) => {
  const item = productsModel.getProduct(id);
  if (!item) return;
  if (!cartModel.isItemInCart(id)) {
    cartModel.addItem(item);
  }
  events.emit('basket:change', {});
});
events.on<{ id: ProductId }>('basket/remove', ({ id }) => {
  if (cartModel.isItemInCart(id)) {
    cartModel.removeItem(id);
  }
  events.emit('basket:change', {});
});  
events.on('basket/open', () => openBasket());

events.on('basket:change', () => {
  const nodes: HTMLElement[] = cartModel.getCartItems().map((it, idx) => {
    const line = new BasketLine(events, { id: it.id, title: it.title, price: it.price, index: idx + 1 });
    return line.getElement();
  });
  catalogView.items = nodes;
  catalogView.total = cartModel.getTotalPrice();
  catalogView.items = nodes;
  catalogView.total = cartModel.getTotalPrice();
  headerCart.setCount(cartModel.getCartItems().length);

   if (currentPreview && currentPreviewId) {
    currentPreview.setInBasket(cartModel.isItemInCart(currentPreviewId));
  }
});

events.on<{ key: string; value: any }>('order:change', ({ key, value }) => {
  if (key === 'payment') {
    buyerModel.setBuyerData({ payment: value });
    buyerModel.validate();
  } else if (key === 'address') {
    buyerModel.setBuyerData({ address: value });
    buyerModel.validate();
  }
}); 

events.on('basket/checkout', () => {
  modalView.open(orderStep1View.render());
  buyerModel.validate();
});

events.on('modal/close', () => {
  currentPreview = null;
  currentPreviewId = null;
});

events.on<{ errors: { payment?: string; address?: string } }>('form:errors', ({ errors }) => {
  orderStep1View.showErrors(errors);
});

events.on<{ data: { payment: 'card' | 'cash'; address: string } }>('order/step1/next', ({ data }) => {
  buyerModel.setBuyerData({ payment: data.payment });
  buyerModel.setBuyerData({ address: data.address });
  modalView.open(orderStep2View.render());
});

events.on<{ data: { email: string; phone: string } }>('order/step2/pay', async ({ data }) => {
  buyerModel.setBuyerData({ email: data.email });
  buyerModel.setBuyerData({ phone: data.phone });

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
    const amountEl = ensureElement<HTMLElement>('.order-success__description', node) as HTMLElement;
    if (amountEl) amountEl.textContent = `Списано ${cartModel.getTotalPrice()} синапсов`;
    const closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', node) as HTMLButtonElement;
    if (closeBtn) closeBtn.addEventListener('click', () => modalView.close());
    modalView.open(node);

    cartModel.cartItems = [];
    headerCart.setCount(cartModel.getCartItems().length);
  } catch (e) {
    console.error('Не удалось оформить заказ:', e);
  }
});


(async () => {
  try { 
    const items = await service.getProducts();
    productsModel.setArrayProducts(items);
    renderCatalog();
    events.emit('basket:change', {});
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
})();