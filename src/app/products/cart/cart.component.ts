import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  cartItems: any = []
  cartItemsCount: any = 0
  cartTotalPrice: number = 0
  offerShown: boolean = false
  finalAmount: number = 0
  offerAvl: boolean = true
  proceedBtn: boolean = false
  discount: number = 0
  makePaymentStatus: boolean = false
  showSuccess: boolean = false
  showCancel: boolean = false
  showError: boolean = false

  user: any = {};
  addressForm = this.fb.group({
    username: [''],
    addr1: [''],
    addr2: [''],
    addr3: ['']
  })

  constructor(private api: ApiService, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.getCart()
    this.initConfig()


    this.api.cartItemCount.subscribe(
      (count: any) => {
        this.cartItemsCount = count
      }
    )
  }

  getCart() {
    this.api.getcart().subscribe(
      (result: any) => {
        console.log(result);
        this.cartItems = result
        this.getcartTotalPrice()
      },
      (result: any) => {
        console.log(result.error);

      }
    )
  }

  getcartTotalPrice() {
    let total = 0
    this.cartItems.forEach((item: any) => {
      total += item.grandTotal
    });
    this.cartTotalPrice = parseInt(total.toFixed(2))
    this.finalAmount = this.cartTotalPrice
  }

  removeCartItem(id: any) {
    this.api.removeCartItem(id).subscribe(
      (result: any) => {
        this.cartItems = result
        this.getcartTotalPrice()
        this.api.cartCount()
      },
      (result: any) => {
        alert(result.error)
      })
  }
  incrCartItem(id: any) {
    this.api.incrCartItem(id).subscribe(
      (result: any) => {
        this.cartItems = result
        this.getcartTotalPrice()
        this.api.cartCount()
      },
      (result: any) => {
        alert(result.error)
      }
    )
  }
  decrCartItem(id: any) {
    this.api.decrCartItem(id).subscribe(
      (result: any) => {
        this.cartItems = result
        this.getcartTotalPrice()
        this.api.cartCount()
      },
      (result: any) => {
        alert(result.error)
      }
    )
  }

  emptyCart() {
    this.api.emptyCart().subscribe(
      (result: any) => {
        this.cartItems = []
        this.getcartTotalPrice()
        this.api.cartCount()
      },
      (result: any) => {
        alert(result.error)
      }
    )
  }
  // offers button
  showOffers() {
    this.offerShown = true
  }

  discount20() {
    this.discount = this.cartTotalPrice * 20 / 100
    this.finalAmount = this.finalAmount - this.discount
    this.offerShown = false
    this.offerAvl = false
  }

  discount10() {
    this.discount = this.cartTotalPrice * 10 / 100
    this.finalAmount = this.finalAmount - this.discount
    this.offerShown = false
    this.offerAvl = false
  }

  submit() {
    if (this.addressForm.valid) {
      this.proceedBtn = true
      this.user.username = this.addressForm.value.username
      this.user.street = this.addressForm.value.addr1
      this.user.address = this.addressForm.value.addr3
      this.user.pincode = this.addressForm.value.addr2

    } else {
      alert("invalid form")
    }
  }

  makePayment() {
    this.makePaymentStatus = true
}

private initConfig(): void {
  this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: '9.99',
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: '9.99'
            }
          }
        },
        items: [{
          name: 'Enterprise Subscription',
          quantity: '1',
          category: 'DIGITAL_GOODS',
          unit_amount: {
            currency_code: 'EUR',
            value: '9.99',
          },
        }]
      }]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details: any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });

    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
      alert("Payment successfull")
      this.emptyCart()

    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.showCancel = true;
      alert("your transaction cancelled")

    },
    onError: err => {
      console.log('OnError', err);
      this.showError = true;
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
      // this.resetStatus();
    }
  };
}
modalClose(){
this.addressForm.reset()
this.proceedBtn = false
this.showCancel = false
this.showSuccess = false
this.showError = false
this.makePaymentStatus = false
}

}  
