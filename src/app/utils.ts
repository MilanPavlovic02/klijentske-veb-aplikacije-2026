import { Injectable } from '@angular/core';
import { ToysModel } from '../models/toy.model';

//Injectable cini ovu aplikaciju dstupnu u celoj aplikaciji
@Injectable({
  providedIn: 'root',
})

//generise dinamicki url za sliku igracke na osnovu id
export class Utils {
  getImageUrl(toys: ToysModel) {
    return `https://toy.pequla.com/img/${toys.toyId}.png`;
  }
}
