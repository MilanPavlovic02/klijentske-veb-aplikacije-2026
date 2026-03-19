import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToysModel } from '../../models/toy.model';
import { Utils } from '../utils';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../services/auth.services';
import { MatButtonModule } from '@angular/material/button';
import { ToyService } from '../services/toy.services';
import { Loading } from '../loading/loading';
import { ReviewModel } from '../../models/review.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.services';
import { ReviewService } from '../services/review.services';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-details',
  imports: [
    MatListModule,
    MatIcon,
    MatCardModule,
    MatButtonModule,
    Loading,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  //lokalne promenjiva za formu recenzije i kolicine
  public quantity: number = 1;
  public selectedRating: number = 5;
  public authService = AuthService;

  //signal koj cuva trenutnu igracku dok se ne ocita on je null
  toys = signal<ToysModel | null>(null);
  public reviews: ReviewModel[] = [];
  public newReview = '';

  constructor(
    private route: ActivatedRoute,
    public utils: Utils,
    private cartService: CartService,
    private reviewService: ReviewService,
    private router: Router,
  ) {
    //menjamo parametre u URL
    this.route.params.subscribe((params) => {
      const id = +params['id'];

      //pozivamo servis koji simulira api
      ToyService.getToysById(id).then((rsp) => {
        //smestamo podatke u signal i ucitavamo recenzije
        this.toys.set(rsp.data);
        this.reviews = this.reviewService.getReviewsForToy(id);
      });
    });
  }

  //metoda za slanje nove recenzije
  addReview() {
    //uzimamo trenutnu igrcku iz signala
    const toy = this.toys();
    //ne moze da salje prazno
    if (!this.newReview.trim() || !toy) return;

    const currentUser = this.authService.getActiveUser();
    if (currentUser) {
      const review: ReviewModel = {
        user: currentUser.firstName,
        text: this.newReview,
        rating: this.selectedRating,
      };

      //cuvamo u localStoraga
      this.reviewService.saveReview(toy.toyId, review);

      //osvezavamo listu
      this.reviews = this.reviewService.getReviewsForToy(toy.toyId);

      //resetujemo formu
      this.newReview = '';
      this.selectedRating = 5;
    }
  }

  //metoda za dodavalje u korpu
  orderToy() {
    const toy = this.toys();
    if (toy) {
      //u ovoj petlji dodajemo onoliko igracaka koliko su definisane u quantity
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(toy);
        Alerts.cartComfirm('Da li zelita da nastavite u korup ?', () => {
          this.router.navigate(['/cart']);
        });
      }
    }
  }
}
