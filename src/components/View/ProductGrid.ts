import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { GridCard, type ProductCardProps } from './GridCard';

export interface CatalogState {
  items: ProductCardProps[];
}

export class ProductGrid extends Component<CatalogState> {
  private root: HTMLElement;
  private cards: Map<string, GridCard> = new Map();
  private viewState: CatalogState = { items: [] };

  constructor(private readonly events: IEvents) {
    const container = document.querySelector('main.gallery') || document.createElement('main');
    if (!container.classList.contains('gallery')) container.classList.add('gallery');
    super(container as HTMLElement);
    this.root = container as HTMLElement;
  }

  setState(patch: Partial<CatalogState>) {
    this.viewState = { ...this.viewState, ...patch };
    this.render();
  }

  render(): HTMLElement {
    this.cards.clear();
    const nodes = this.viewState.items.map((p) => {
      const card = new GridCard(this.events, p);
      this.cards.set(p.id, card);
      return card.getElement();
    });

    this.root.replaceChildren(...nodes);
    return this.root;
  }
  

  getElement() {
    return this.root;
  }
}
