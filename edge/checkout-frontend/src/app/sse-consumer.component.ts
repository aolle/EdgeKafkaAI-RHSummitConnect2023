import { Component, OnInit } from '@angular/core';
import { SseService } from './sse.service';

@Component({
  selector: 'app-sse-consumer',
  templateUrl: './sse-consumer.component.html',
  styleUrls: ['./sse-consumer.component.scss']
})
export class SseConsumerComponent implements OnInit {
  inventory: any[] = [];
  products: any[] = [];

  constructor(private sseService: SseService) { }

  ngOnInit(): void {
    const endpointUrl = 'http://localhost:8080/inventory';

    const eventSource = this.sseService.connectToSseEndpoint(endpointUrl);

    eventSource.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);

      if (this.inventory.length == 0) {
        this.inventory = eventData[0];
      }
      this.products = eventData[0];
    });
  }

  selectedProducts: any[] = [];
  showPopup: boolean = false;
  selectedProduct: any;
  selectedQuantity: number = 1;

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

  }

  reset() {
    this.selectedProducts = [];
  }

}
