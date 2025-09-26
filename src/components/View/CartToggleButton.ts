import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement} from '../../utils/utils';

type HeaderCartState = { count: number };

export class CartToggleButton extends Component<HeaderCartState> {
  private root: HTMLButtonElement;
  private counterEl: HTMLElement; 
  
  constructor(private readonly events: IEvents) {
    const root = ensureElement<HTMLButtonElement>('.header__basket');
    if (!root) throw new Error('HeaderCartButtonView: .header__basket not found');
    super(root);

    this.root = root;
    this.counterEl = (ensureElement<HTMLElement>('.header__basket-counter',root) as HTMLElement) || root;

    // Открытие корзины по клику на кнопку в шапке
    this.root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('basket/open', {});
    });
  } 
 
   setCount(count: number) {
    const val = Number.isFinite(count) ? count : 0;
    if (this.counterEl) this.counterEl.textContent = String(val);
  }
 
  render(): HTMLElement {
    return this.root;
  }
}
