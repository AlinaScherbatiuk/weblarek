import type { IEvents } from '../base/Events';
import { cloneTemplate } from './utils';
import { BaseFormView } from './BaseFormView';

export interface OrderStep2State {
  email: string;
  phone: string;
  errors: { email?: string; phone?: string };
}

export class CheckoutContactsStep extends BaseFormView<OrderStep2State> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private viewState: OrderStep2State = { email: '', phone: '', errors: {} };

  constructor(private readonly events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('contacts');
    super(form);
    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    
    const onInput = () => {
      this.viewState.email = this.emailInput.value;
      this.viewState.phone = this.phoneInput.value;
      this.validate(); this.render();
    };
    this.emailInput.addEventListener('input', onInput);
    this.phoneInput.addEventListener('input', onInput);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
      if (!this.hasErrors()) {
        this.events.emit('order/step2/pay', { data: { email: this.viewState.email, phone: this.viewState.phone } });
      }
    });    
   this.validate(); this.render();
  }

  private hasErrors() { return Boolean(this.viewState.errors.email || this.viewState.errors.phone); }
  private validate() {
    const errors: OrderStep2State['errors'] = {};
    if (!this.viewState.email || this.viewState.email.trim().length==0) errors.email = 'Введите e-mail';
    if (!this.viewState.phone || this.viewState.phone.trim().length==0) errors.phone = 'Введите телефон';
    this.viewState.errors = errors;
    this.setSubmitDisabled(this.hasErrors());
  }

  render(): HTMLElement {
    this.setError(this.viewState.errors.email || this.viewState.errors.phone || '');
    this.setSubmitDisabled(this.hasErrors());
    return this.formEl;
  }
}
