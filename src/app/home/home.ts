import { Component, signal } from '@angular/core';
import { ToysModel } from '../../models/toy.model';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Utils } from '../utils';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.services';
import { ToyService } from '../services/toy.services';
import { Loading } from '../loading/loading';
import { CartService } from '../services/cart.services';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ReviewService } from '../services/review.services';
import { Alerts } from '../alerts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Loading,
    FormsModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  //omogucava proveru statusa korisnika
  public authService = AuthService;

  //signali za sve podatke, podatke posle filtriranja i podaci koji se trenutno vide
  toys = signal<ToysModel[]>([]);
  filteredToys = signal<ToysModel[]>([]);
  paginatedToys = signal<ToysModel[]>([]);

  //parametri za navigaciju kroz stranicu
  currentPage = 1;
  pageSize = 10;
  sortOrder = signal<string>('');

  //objekat koji cuva ternutno izabrane kriterijume pretrage
  filters = {
    type: '',
    age: '',
    group: '',
    rating: '',
  };

  constructor(
    public utils: Utils,
    private cartService: CartService,
    private reviewService: ReviewService,
    private router: Router,
  ) {
    //uzimamo sve igracke i pocetne filtere
    ToyService.getToys().then((rsp) => {
      this.toys.set(rsp.data);
      this.applyFilters();
    });
  }

  //dodavanje u korupu sa pocetne strane
  addToCart(toy: any) {
    this.cartService.addToCart(toy);
    Alerts.cartComfirm('Da li zelita da nastavite u korup ?', () =>
      this.router.navigate(['/cart']),
    );
  }

  //pomocna metoda koja uzima ocenu za potrebe sortiranja
  getRating(toyId: number): number {
    return this.reviewService.getAverageRating(toyId);
  }

  //metoda za filtriranje i sortiranje
  applyFilters() {
    //uzima kopiju svih igracaka
    let data = [...this.toys()];

    //filtriramo po tri kriterijuma
    data = data.filter(
      (t) =>
        (!this.filters.type ||
          t.type.name.toLowerCase() === this.filters.type.toLowerCase()) &&
        (!this.filters.age ||
          t.ageGroup.name.toLowerCase() === this.filters.age.toLowerCase()) &&
        (!this.filters.group ||
          t.targetGroup.toLowerCase() === this.filters.group.toLowerCase()),
    );

    //sortiranje na osnovu ocena
    if (this.sortOrder() === 'desc') {
      data.sort((a, b) => this.getRating(b.toyId) - this.getRating(a.toyId));
    } else if (this.sortOrder() === 'asc') {
      data.sort((a, b) => this.getRating(a.toyId) - this.getRating(b.toyId));
    }

    //cuvamo rezultate, resetujemo na 1 stranu i kratimo niz prikaza
    this.filteredToys.set(data);
    this.currentPage = 1;
    this.applyPagination();
  }

  setSort(e: any) {
    this.sortOrder.set(e.value);
    this.applyFilters();
  }

  //kratimo niz da bih prikazali prvih 10 elemenata
  applyPagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedToys.set(this.filteredToys().slice(start, end));
  }

  //metoda za promenu stranica
  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredToys().length) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  setType(e: any) {
    this.filters.type = e.value;
    this.applyFilters();
  }

  setAge(e: any) {
    this.filters.age = e.value;
    this.applyFilters();
  }

  setGroup(e: any) {
    this.filters.group = e.value;
    this.applyFilters();
  }
  setRating(e: any) {
    this.filters.rating = e.target.value;
    this.applyFilters();
  }
}
