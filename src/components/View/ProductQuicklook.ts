
import type { IEvents } from '../base/Events';
import type { ProductId, Price } from '../../types';
 
import { BaseCardView } from './BaseCardView';
import { ensureElement,cloneTemplate } from '../../utils/utils';

export interface ProductPreviewProps {
  id: ProductId;
  title: string;
  description?: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
}

export class ProductQuicklook extends BaseCardView<ProductPreviewProps> {
  private root: HTMLElement;
  private btn: HTMLButtonElement;
  private descEl: HTMLElement;
  private id: ProductId;
  private price: Price;
  private inBasket: boolean;

  constructor(private readonly events: IEvents, props: ProductPreviewProps) {
    const root = cloneTemplate<HTMLElement>('#card-preview');
    super(root);
    this.root = root;
    this.titleEl = (ensureElement<HTMLElement>('.card__title', root) as HTMLElement) || undefined;
    this.descEl = (ensureElement<HTMLElement>('.card__text', root) as HTMLElement) || document.createElement('div');
    this.priceEl = (ensureElement<HTMLElement>('.card__price', root) as HTMLElement) || undefined;
    this.categoryEl = (ensureElement<HTMLElement>('.card__category', root) as HTMLElement) || undefined;

    const imgNode = ensureElement<HTMLElement>('.card__image', root) as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;

    this.btn = (ensureElement<HTMLButtonElement>('.card__button', root) as HTMLButtonElement) || document.createElement('button');

    this.id = props.id;
    this.price = props.price;
    this.inBasket = props.inBasket;
    this.setTitle(props.title);
    this.descEl.textContent = props.description ?? '';
    this.applyImage(props.image, props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);
    this.updateButton();

    // клик «Купить» / «Удалить из корзины»
    this.btn.addEventListener('click', () => {
      if (this.price === null) return;
      this.inBasket = !this.inBasket;
      this.updateButton();
      this.events.emit(this.inBasket ? 'product/add' : 'basket/remove', { id: this.id });

    });

    this.updateButton();
  }

  public setInBasket(value: boolean) {
    this.inBasket = Boolean(value);
    this.updateButton();
  }

  private updateButton() {
    if (this.price === null) {
      this.btn.textContent = 'Недоступно';
      this.btn.disabled = true;
    } else {
      this.btn.textContent = this.inBasket ? 'Удалить из корзины' : 'Купить';
      this.btn.disabled = false;
    }
  }

  getElement() {
    return this.root;
  }
}
