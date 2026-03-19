import { Injectable } from '@angular/core';

//kluc za cuvanje niza podatalka u localStorage
const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  //dohvatamo trenutno stanje korpe
  getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  //dodajemo igracku u korpu ili povecavamo koliciu
  addToCart(toy: any) {
    const cart = this.getCart();

    const existing = cart.find((t: any) => t.toyId === toy.toyId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...toy, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  //brisemo odredjenu igracku iz korpe
  removeFromCart(toyId: number) {
    const cart = this.getCart().filter((t: any) => t.toyId !== toyId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  //potpuno praznjenje korpe
  clearCart() {
    localStorage.removeItem(CART_KEY);
  }

  //pomocna metoda za cuvanje niza u localstoraga
  saveCart(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  //menjamo kolicinu itema
  updateQuantity(toyId: number, quantity: number) {
    const cart = this.getCart();

    const item = cart.find((t: any) => t.toyId === toyId);

    if (item) {
      item.quantity = quantity;

      if (item.quantity <= 0) {
        this.removeFromCart(toyId);
        return;
      }
    }

    this.saveCart(cart);
  }

  //racunanje ukupne sume igracaka
  getTotalPrice() {
    const cart = this.getCart();

    return cart.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);
  }
}
