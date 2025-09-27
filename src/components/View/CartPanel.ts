import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CartPanel extends Component<unknown> {
  private root: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private emptyText = 'Корзина пуста';

  constructor(private readonly events: IEvents) {
    const tpl = document.getElementById('basket') as HTMLTemplateElement;
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(root);

    this.root = root;
    this.listEl = ensureElement<HTMLElement>('.basket__list', root) as HTMLElement;
    this.totalEl = ensureElement<HTMLElement>('.basket__price', root) as HTMLElement;
    this.checkoutBtn = ensureElement<HTMLElement>('.basket__button', root) as HTMLButtonElement;

    this.checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('basket/checkout', {} as any);
    });
    if (this.listEl) {
      (this.listEl as HTMLElement).style.maxHeight = '60vh';
      (this.listEl as HTMLElement).style.overflowY = 'auto';
    }
  }

  set items(nodes: HTMLElement[]) {
    const list = Array.isArray(nodes) ? nodes : [];
    if (list.length === 0) {
      const li = document.createElement('li');
      li.className = 'basket__item';
      li.textContent = this.emptyText;
      this.listEl.replaceChildren(li);
    } else {
      this.listEl.replaceChildren(...list);
    }
    this.checkoutBtn.disabled = list.length === 0;
  }

  set total(value: number) {
    const totalNum = typeof value === 'number' ? value : 0;
    this.totalEl.textContent = `${totalNum} ${settings.labels.currency}`;
  }

  render(): HTMLElement {
    return this.root;
  }
}
