
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

  validate(): boolean {
    const valid =
      !!this.payment &&
      !!this.email &&
      !!this.phone &&
      !!this.address; 
    return valid;
  }
}

export { Buyer };
