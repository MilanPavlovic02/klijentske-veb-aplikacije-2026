import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../services/cart.services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Utils } from '../utils';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(
    private cartService: CartService,
    public router: Router,
    public utils: Utils,
  ) {
    //zastika koja vraca na login ako korisnik nije ulogovan
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login']);
      return;
    }
    this.loadCart(); //Ucitava korpu ulogovanog korisnika
  }

  //Singal sluzi za pracenje angular vrednosti i
  //automatskog osvezavanja HTML-a kada se promeni
  cartItems = signal<any[]>([]); //lista igracaka u korpi
  totalPrice = signal<number>(0); //ukupna cena svih igracaka

  //ova metoda osvezava podatke u signalima koje povlacimo iz servisa
  loadCart() {
    const items = this.cartService.getCart();
    //azuriramo listu i ukupnu cenu
    this.cartItems.set(items);
    this.totalPrice.set(this.cartService.getTotalPrice());
  }

  //ova metoda povecava kolicinu izabrane igracke za 1
  increase(item: any) {
    item.quantity++; //lokalno uvecanje
    this.cartService.updateQuantity(item.toyId, item.quantity); //cuvanje u bazi/storedzu
    this.loadCart(); //ponovno povlacenje ukupne cene
  }

  //smanjivanje igracaka za 1
  decrease(item: any) {
    item.quantity--;
    this.cartService.updateQuantity(item.toyId, item.quantity);
    this.loadCart();
  }

  //uklanjanje igracaka iz korpe
  remove(item: any) {
    this.cartService.removeFromCart(item.toyId);
    this.loadCart(); //osvezava listu
  }

  //galvna metoda za narucivanje
  checkout() {
    //uzaima trenutno stanje signala
    const items = this.cartItems();
    const total = this.totalPrice();

    //proverava da li nesto ima u korpi
    if (items.length === 0) {
      Alerts.error('Vaša korpa je prazna!');
      return;
    }

    //Kreira objekat porudzbine
    const newOrder = {
      orderId: Date.now(), //koristimo trenutno vreme kao id porudzbine
      date: new Date().toLocaleString('sr-RS'), //formatiramo datum
      items: [...items], //pravimo kopiju niza artikla
      totalPrice: total,
    };

    //Upisujemo porudzbinu u aktivnog korisnika
    const success = AuthService.addOrderToActiveUser(newOrder);

    if (success) {
      Alerts.success('Porudžbina je uspešno sačuvana ');

      //brisemo sve is privremene korpe i osvezavamo ui
      this.cartService.clearCart();
      this.loadCart();

      //vracamo kupca napocetnu stranu
      this.router.navigate(['/']);
    } else {
      Alerts.error('Greška pri čuvanju porudžbine.');
    }
  }
}
