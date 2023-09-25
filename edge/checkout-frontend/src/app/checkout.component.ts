import { Component, OnInit } from '@angular/core';
import { SseService } from './sse.service';
import { Product } from './models/product';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  isLoading: boolean = true;

  inventory: any[] = [];
  products: any[] = [];

  selectedProducts: any[] = [];
  showPopup: boolean = false;
  selectedProduct: any;
  selectedQuantity: number = 1;

  showPopupCheckout = false;
  popupCheckoutMessage = '';

  constructor(private sseService: SseService) { }

  ngOnInit(): void {

    const inventoryEndpointUrl = 'http://localhost:8080/inventory';
    const updatesEndpointUrl = 'http://localhost:8080/inventory/updates';

    const eventInventoryUpdatesSource = this.sseService.connectToSseEndpoint(updatesEndpointUrl);
    const eventInventorySource = this.sseService.connectToSseEndpoint(inventoryEndpointUrl);

    eventInventoryUpdatesSource.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);
      this.products = eventData[0];
    });

    eventInventorySource.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);
      this.inventory = eventData[0];
      if(this.isLoading) {
        this.isLoading = false;
      }
    });

  }

  printData(data: any[], label: string) {
    console.log(label + ':');
    data.forEach(item => {
      console.log(`${item.name} (Quantity: ${item.quantity})`);
    });
  }

  openPopup(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  incrementQuantity() {
    this.selectedQuantity++;
  }

  decrementQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addProduct() {
    if (this.selectedProduct && this.selectedQuantity > 0) {
      const existingProduct = this.selectedProducts.find(product => product.name === this.selectedProduct.name);

      if (existingProduct) {
        existingProduct.quantity += this.selectedQuantity;
      } else {
        this.selectedProducts.push({
          name: this.selectedProduct.name,
          quantity: this.selectedQuantity
        });
      }

      this.showPopup = false;
    }
  }

  checkout() {
    if (this.arraysAreEqual(this.products, this.selectedProducts)) {
      this.showCheckoutPopupMessage("OK");

    } else {
      this.showCheckoutPopupMessage("Missing item(s)");
    }
  }

  reset() {
    this.selectedProducts = [];
  }

  arraysAreEqual(array1: Product[], array2: Product[]) {
    return JSON.stringify(array1) === JSON.stringify(array2);
  }

  showCheckoutPopupMessage(message: string) {
    this.popupCheckoutMessage = message;
    this.showPopupCheckout = true;
  }

  closeCheckoutPopup() {
    this.showPopupCheckout = false;
    this.popupCheckoutMessage = '';
  }

}
