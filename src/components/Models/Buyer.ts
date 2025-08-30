
import { IBuyer, TPayment } from '../../types';

class Buyer implements IBuyer {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;

  constructor(payment: TPayment, email: string, phone: string, address: string) {
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
    if (typeof data.payment !== 'undefined') this.payment = data.payment as TPayment;
    if (typeof data.email !== 'undefined') this.email = data.email;
    if (typeof data.phone !== 'undefined') this.phone = data.phone;
    if (typeof data.address !== 'undefined') this.address = data.address;
  }

  validateField(field: keyof IBuyer): boolean {
    switch (field) {
      case 'payment':
        return this.payment === 'card' || this.payment === 'cash';
      case 'email':
        return this.email.trim().includes('@');
      case 'phone':
        return this.phone.replace(/\D/g, '').length >= 8;
      case 'address':
        return this.address.trim().length > 0;
      default:
        return false;
    }
  }

  validate(): boolean {
    return (
      this.validateField('payment') &&
      this.validateField('email') &&
      this.validateField('phone') &&
      this.validateField('address')
    );
  }
}

export { Buyer };
