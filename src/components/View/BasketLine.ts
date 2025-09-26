import type { IEvents } from '../base/Events';
import type { Price, ProductId } from '../../types';
import { ensureElement,cloneTemplate } from '../../utils/utils';
import { BaseCardView } from './BaseCardView';

export interface BasketItemProps {
  id: ProductId;
  title: string;
  price: Price;
  category?: string;
  index?: number; }

export class BasketLine extends BaseCardView<BasketItemProps> {
  protected root: HTMLElement;
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected delBtn: HTMLButtonElement;
  protected id: ProductId;

  constructor(private readonly events: IEvents, props: BasketItemProps) {
    const root = cloneTemplate<HTMLElement>('#card-basket');
    super(root);
    this.root = root;

    this.titleEl   = ensureElement<HTMLElement>('.card__title', root) as HTMLElement;
    this.priceEl   = ensureElement<HTMLElement>('.card__price', root) as HTMLElement;
    this.delBtn    = ensureElement<HTMLButtonElement>('.card__button', root) as HTMLButtonElement;
    this.delBtn.addEventListener('click', () => {
      this.events.emit('basket/remove', { id: this.id }); 
  });
    this.id = props.id;
    this.setTitle(props.title);
    this.setPrice(props.price);
    this.setCategory(props.category); 

    const indexEl = ensureElement<HTMLElement>('.basket__item-index',root) as HTMLElement;
    if (indexEl) indexEl.textContent = String(props.index ?? 0);

    this.delBtn.addEventListener('click', () => {
      this.events.emit('basket/remove', { id: this.id });
    });
  }

  getElement() { return this.root; }
}
