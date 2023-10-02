import { Component, OnInit } from '@angular/core';
import { SseService } from './sse.service';

import { environment } from '../environments/environment';

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
  missingProducts: any[] = [];

  showPopup: boolean = false;
  selectedProduct: any;
  selectedQuantity: number = 1;

  showPopupCheckout = false;
  popupCheckoutMessage = '';

  constructor(private sseService: SseService) { }

  ngOnInit(): void {

    const inventoryEndpointUrl = environment.inventoryEndpointUrl;
    const updatesEndpointUrl = environment.updatesEndpointUrl;

    const eventInventoryUpdatesSource = this.sseService.connectToSseEndpoint(updatesEndpointUrl);
    const eventInventorySource = this.sseService.connectToSseEndpoint(inventoryEndpointUrl);

    // checkout
    eventInventoryUpdatesSource.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);
      this.products = eventData[0];
    });

    // initial inventory
    eventInventorySource.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);
      this.inventory = eventData[0];
      if (this.isLoading) {
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
          id: this.selectedProduct.id,
          name: this.selectedProduct.name,
          quantity: this.selectedQuantity
        });
      }

      this.showPopup = false;
    }
  }

  checkout() {
    console.log("Products: " + JSON.stringify(this.products) + "\nSelected: " + JSON.stringify(this.selectedProducts));

    if (this.products.length === 0) {
      this.showCheckoutPopupMessage("Please wait while the system is loading.");
      return;
    }

    const hasSelectedItems = this.selectedProducts.length > 0;

    const hasIncorrectProducts = this.selectedProducts.some(selectedProduct => {
      return !this.products.some(product => product.id === selectedProduct.id);
    });

    const missingProducts = this.products.filter(product => {
      const selectedProduct = this.selectedProducts.find(selected => selected.id === product.id);
      return !selectedProduct || selectedProduct.quantity < product.quantity;
    });

    const hasExcessQuantities = this.selectedProducts.some(selectedProduct => {
      const product = this.products.find(p => p.id === selectedProduct.id);
      return product && selectedProduct.quantity > product.quantity;
    });

    if (!hasSelectedItems) {
      this.showCheckoutPopupMessage("Please select items before checking out.");
    } else if (hasIncorrectProducts) {
      this.showCheckoutPopupMessage("You have selected an incorrect set of products.");
    } else if (missingProducts.length === 0) {
      this.showCheckoutPopupMessage("OK");
    } else if (hasExcessQuantities) {
      this.showCheckoutPopupMessage("Please review your cart. Excess quantity selected.");
    } else {
      this.missingProducts = this.calculateQuantityDifference();
      this.showCheckoutPopupMessage("Missing items or quantity!!");
    }
  }

  calculateQuantityDifference() {
    const quantityDifference: { id: number, name: string, difference: number }[] = [];

    for (const product of this.products) {
      const selectedProduct = this.selectedProducts.find(sp => sp.id === product.id) || { quantity: 0 };
      const difference = product.quantity - selectedProduct.quantity;

      if (difference !== 0) {
        quantityDifference.push({ id: product.id, name: product.name, difference });
      }
    }

    for (const selectedProduct of this.selectedProducts) {
      const product = this.products.find(p => p.id === selectedProduct.id);
      if (!product) {
        quantityDifference.push({ id: selectedProduct.id, name: selectedProduct.name, difference: -selectedProduct.quantity });
      }
    }

    return quantityDifference;
  }

  reset() {
    this.selectedProducts = [];
  }

  showCheckoutPopupMessage(message: string) {
    this.popupCheckoutMessage = message;
    this.showPopupCheckout = true;
  }

  closeCheckoutPopup() {
    this.missingProducts = [];
    this.showPopupCheckout = false;
    this.popupCheckoutMessage = '';
  }

  getProductImageStyle(selectedProduct: any) {
    let imageBase64 = '';
    if (selectedProduct.image) {
      imageBase64 = `url('data:image/png;base64,${selectedProduct.image}')`;
    } else {
      const product = this.inventory.find((p: any) => p.id === selectedProduct.id);
      if (product?.image) {
        imageBase64 = `url('data:image/png;base64,${product.image}')`;
      }
    }

    if (imageBase64) {
      return {
        'background-image': imageBase64,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
      };
    } else {
      return {
        'background-color': '#ffffff',
      };
    }
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }

}
