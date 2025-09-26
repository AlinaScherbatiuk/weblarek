import type { IEvents } from '../base/Events';
import type { TPayment } from '../../types';
import { BaseFormView } from './BaseFormView';
import { ensureElement,cloneTemplate } from '../../utils/utils';

export interface OrderStep1State {
  payment: TPayment | null;
  address: string;
  errors: { payment?: string; address?: string };
}

export class CheckoutDetailsStep extends BaseFormView<OrderStep1State> {
  private addressInput: HTMLInputElement;
  private payCardBtn: HTMLButtonElement;
  private payCashBtn: HTMLButtonElement;

  private viewState: OrderStep1State = { payment: null, address: '', errors: {} };

  constructor(private readonly events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('#order');
    super(form);
    this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', form) as HTMLButtonElement;
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', form) as HTMLElement;
    this.payCardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', form) as HTMLButtonElement;
    this.payCashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', form) as HTMLButtonElement;
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', form) as HTMLInputElement;

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:change', { key: 'address', value: this.addressInput.value });
    });

  this.payCardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.payCardBtn.classList.add('button_alt-active');
      this.payCashBtn.classList.remove('button_alt-active');
      this.events.emit('order:change', { key: 'payment', value: 'card' });
    });

  this.payCashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.payCashBtn.classList.add('button_alt-active');
      this.payCardBtn.classList.remove('button_alt-active');
      this.events.emit('order:change', { key: 'payment', value: 'cash' });
    });


    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order/step1/next', { data: { } } as any);
    });
  }
applyState(state: { payment?: TPayment | null; address?: string }) {
  if (state.payment !== undefined) {
    this.payCardBtn.classList.toggle('button_alt-active', state.payment === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', state.payment === 'cash');
    this.viewState = { ...(this.viewState ?? { payment: null, address: '', errors: {} }), payment: state.payment ?? null };
  }
  if (state.address !== undefined && this.addressInput) {
    if (this.addressInput.value !== state.address) this.addressInput.value = state.address ?? '';
    this.viewState = { ...(this.viewState ?? { payment: null, address: '', errors: {} }), address: state.address ?? '' };
  }
}
   
  showErrors(errors: { payment?: string; address?: string }) {
    const message = errors.payment || errors.address || '';
    this.setError(message);
    this.setSubmitDisabled(Boolean(message));
  }
  render(): HTMLElement {     
    return this.formEl;
  }
}
