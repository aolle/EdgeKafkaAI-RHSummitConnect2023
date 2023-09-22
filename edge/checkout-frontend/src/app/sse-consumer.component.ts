import { Component, OnInit } from '@angular/core';
import { SseService } from './sse.service';

@Component({
  selector: 'app-sse-consumer',
  templateUrl: './sse-consumer.component.html',
  styleUrls: ['./sse-consumer.component.scss']
})
export class SseConsumerComponent implements OnInit {
  inventory: any[] = [];

  constructor(private sseService: SseService) { }

  ngOnInit(): void {
    const endpointUrl = 'http://localhost:8080/inventory';

    const eventSource = this.sseService.connectToSseEndpoint(endpointUrl);

    eventSource.addEventListener('message', (event: MessageEvent) => {
      console.log("JSON event: " + event.data);
      const eventData = JSON.parse(event.data);
      this.inventory = eventData[0];
      console.log("Inventory: " + this.inventory);
    });
  }

  products: any[] = [
    { id: 1, name: 'Prod1' },
    { id: 2, name: 'Prod2' },
    { id: 3, name: 'Prod3' },
  ];

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
      this.selectedProducts.push({
        name: this.selectedProduct.name,
        quantity: this.selectedQuantity
      });

      this.showPopup = false;
    }
  }

  checkout() {

  }
}
