import type { IEvents } from '../base/Events';
import type { Price, ProductId } from '../../types'; 
import { BaseCardView } from './BaseCardView';
import { ensureElement,cloneTemplate } from '../../utils/utils';

export interface ProductCardProps {
  id: ProductId;
  title: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
}

export class GridCard extends BaseCardView<ProductCardProps> {
  private root: HTMLElement;
  private id: ProductId;

  constructor(private readonly events: IEvents, props: ProductCardProps) {
    const root = cloneTemplate<HTMLElement>('#card-catalog');
    super(root);
    this.root = root;

    this.titleEl = (ensureElement<HTMLElement>('.card__title', root) as HTMLElement) || undefined;
    this.priceEl = (ensureElement<HTMLElement>('.card__price', root) as HTMLElement) || undefined;
    this.categoryEl = (ensureElement<HTMLElement>('.card__category', root) as HTMLElement) || undefined;

    const imgNode = ensureElement<HTMLElement>('.card__image', root) as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;

    this.id = props.id;

    this.setTitle(props.title);
    this.applyImage(props.image, props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);

    this.root.addEventListener('click', () => {
      this.events.emit('product/open', { id: this.id });
    });
  }

  getElement() {
    return this.root;
  }
}
