import type { IEvents } from '../base/Events';
import type { TPayment } from '../../types';
import { cloneTemplate } from './utils';
import { BaseFormView } from './BaseFormView';

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
    const form = cloneTemplate<HTMLFormElement>('order');
    super(form);
    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.payCardBtn = form.querySelector('button[name="card"]') as HTMLButtonElement;
    this.payCashBtn = form.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;

    const setPayment = (m: TPayment) => {
      this.viewState.payment = m;
      this.validate(); this.render();
    };
    this.payCardBtn.addEventListener('click', () => setPayment('card'));
    this.payCashBtn.addEventListener('click', () => setPayment('cash'));
    this.addressInput.addEventListener('input', () => {
      this.viewState.address = this.addressInput.value;
      this.validate(); this.render();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
      if (!this.hasErrors()) {
        this.events.emit('order/step1/next', { data: { payment: this.viewState.payment!, address: this.viewState.address } });
      }
    });

   this.validate(); this.render();
  }

  private hasErrors() { return Boolean(this.viewState.errors.payment || this.viewState.errors.address); }
  private validate() {
    const errors: OrderStep1State['errors'] = {};
    if (!this.viewState.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.viewState.address || this.viewState.address.trim().length === 0) errors.address = 'Введите адрес';
    this.viewState.errors = errors;
    this.setSubmitDisabled(this.hasErrors());
  }

  render(): HTMLElement {
    this.payCardBtn.classList.toggle('button_alt-active', this.viewState.payment === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', this.viewState.payment === 'cash');
    this.setError(this.viewState.errors.payment || this.viewState.errors.address || '');
    this.setSubmitDisabled(this.hasErrors());
    return this.formEl;
  }
}
