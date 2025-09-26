import type { IEvents } from '../base/Events';
import { BaseFormView } from './BaseFormView';
import { ensureElement,cloneTemplate } from '../../utils/utils';

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
    const form = cloneTemplate<HTMLFormElement>('#contacts');
    super(form);
    this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', form) as HTMLButtonElement;
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', form) as HTMLElement;
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form) as HTMLInputElement;
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form) as HTMLInputElement;

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
    if (!this.viewState.email || this.viewState.email.trim().length == 0) errors.email = 'Введите e-mail';
    if (!this.viewState.phone || this.viewState.phone.trim().length == 0) errors.phone = 'Введите телефон';
    this.viewState.errors = errors;
    this.setSubmitDisabled(this.hasErrors());
  }

  render(): HTMLElement {
    this.setError(this.viewState.errors.email || this.viewState.errors.phone || '');
    this.setSubmitDisabled(this.hasErrors());
    return this.formEl;
  }
}
