
import { IBuyer, TPayment } from '../../types';
import type { IEvents } from '../base/Events';

class Buyer implements IBuyer {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;

  constructor(payment: TPayment, email: string, phone: string, address: string,private readonly events?: IEvents) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  getDetails(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }
  clearBuyerData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';

  }
  setBuyerData(data: Partial<IBuyer>): void {
    if (typeof data.payment !== 'undefined') this.payment = data.payment;
    if (typeof data.email !== 'undefined') this.email = data.email;
    if (typeof data.phone !== 'undefined') this.phone = data.phone;
    if (typeof data.address !== 'undefined') this.address = data.address;
  }

  changeData(key: keyof IBuyer, value: any) {   
  this[key] = value;
  this.validate();
}

  validateField(field: keyof IBuyer): boolean {
    switch (field) {
      case 'payment':
        return this.payment === 'card' || this.payment === 'cash';
      case 'email':
        return this.email.trim().length>0;
      case 'phone':
        return this.phone.trim().length > 0;
      case 'address':
        return this.address.trim().length > 0;
      default:
        return false;
    }
  }

  validate(): boolean {
   const ok = (
    this.validateField('payment') &&
    this.validateField('email') &&
    this.validateField('phone') &&
    this.validateField('address')
  );
  const errors: { [k: string]: string } = {};
if (!this.payment) errors.payment = 'Выберите способ оплаты';
if (!this.address || !this.address.trim()) errors.address = 'Введите адрес';
this.events?.emit('form:errors', { errors, state: { payment: this.payment, address: this.address } });
return ok;
  }
  
}

export { Buyer };
