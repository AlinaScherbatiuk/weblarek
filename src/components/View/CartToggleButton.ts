import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type HeaderCartState = { count: number };

export class CartToggleButton extends Component<HeaderCartState> {
  private root: HTMLButtonElement;
  private counterEl: HTMLElement;
  private viewState: HeaderCartState = { count: 0 };

  constructor(private readonly events: IEvents) {
    const root = document.querySelector<HTMLButtonElement>('.header__basket');
    if (!root) throw new Error('HeaderCartButtonView: .header__basket not found');
    super(root);

    this.root = root;
    this.counterEl = (root.querySelector('.header__basket-counter') as HTMLElement) || root;

    // Открытие корзины по клику на кнопку в шапке
    this.root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('basket/open', {});
    });
  }

  setState(state: HeaderCartState) {
    this.viewState = { count: state.count ?? 0 };
    this.apply();
  }

  private apply() {
    if (this.counterEl) this.counterEl.textContent = String(this.viewState.count);
  }

  render(): HTMLElement {
    return this.root;
  }
}
