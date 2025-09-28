import type { IEvents } from '../base/Events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class OrderSuccess {
  constructor(private readonly events: IEvents) {}

  render(total: number): HTMLElement {
    const node = cloneTemplate<HTMLElement>('#success');

    const amountEl = ensureElement<HTMLElement>('.order-success__description', node);
    amountEl.textContent = `Списано ${total} синапсов`;

    const closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', node);
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('modal/close', {});
    });

    return node;
  }
}