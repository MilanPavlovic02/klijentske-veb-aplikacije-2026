import { Injectable } from '@angular/core';
import { ReviewModel } from '../../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  //cuvamo predefinisane recenzije prvih 3 igracaka
  private initialReviews: { [key: number]: ReviewModel[] } = {
    1: [
      {
        user: 'Marko',
        text: 'Odlična igračka, deca su oduševljena!',
        rating: 5,
      } as any,
      {
        user: 'Jelena',
        text: 'Kvalitetna plastika, vredi svaku paru.',
        rating: 4,
      } as any,
      {
        user: 'Milan',
        text: 'Stiglo je brzo, sve je kao na slici.',
        rating: 5,
      } as any,
    ],
    2: [
      {
        user: 'Ana',
        text: 'Sjajna slagalica, razvija logiku.',
        rating: 5,
      } as any,
      {
        user: 'Igor',
        text: 'Malo teža za uzrast od 3 godine, ali super.',
        rating: 4,
      } as any,
      { user: 'Sara', text: 'Boje su prelepe uživo.', rating: 5 } as any,
    ],
    3: [
      {
        user: 'Nikola',
        text: 'Očekivao sam da je veće, ali dete se igra.',
        rating: 3,
      } as any,
      {
        user: 'Sofija',
        text: 'Najbolji poklon koji smo kupili ove godine!',
        rating: 5,
      } as any,
      { user: 'Petar', text: 'Dobra izrada, stabilno je.', rating: 4 } as any,
    ],
  };

  //pronalazimo sve recenzije za oderdjenu igracku
  getReviewsForToy(toyId: number): ReviewModel[] {
    const storageKey = `reviews_${toyId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      return JSON.parse(saved);
    }

    if (this.initialReviews[toyId]) {
      return this.initialReviews[toyId];
    }

    return [];
  }

  //dodajemo novu recenziju na vrh liste 
  saveReview(toyId: number, review: ReviewModel): void {
    const reviews = this.getReviewsForToy(toyId);
    reviews.unshift(review);
    localStorage.setItem(`reviews_${toyId}`, JSON.stringify(reviews));
  }

  //raacunanje prosecne ocene
  getAverageRating(toyId: number): number {
    const reviews = this.getReviewsForToy(toyId);
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return sum / reviews.length;
  }
}
