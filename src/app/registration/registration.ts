import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../services/auth.services';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-registration',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  //objekat koji je vezan na inpute u html polja
  userData: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    orders: [],
  };

  constructor(private router: Router) {
    //proveravamo da li je korisnik prijavljane
    if (AuthService.getActiveUser()) {
      this.router.navigate(['/']);
    }
  }

  doRegister() {
    //proveravamo da li su svi podaci unsesni
    if (
      !this.userData.email ||
      !this.userData.password ||
      !this.userData.firstName ||
      !this.userData.address ||
      !this.userData.lastName ||
      !this.userData.phone
    ) {
      Alerts.error('Molimo popunite obavezna polja sav polja !');
      return;
    }

    //upisujemo korisnika i proveravamo da li email ves postoji
    if (AuthService.register(this.userData)) {
      Alerts.success('Uspešna registracija! Sada se možete ulogovati.');
      this.router.navigate(['/login']);
    } else {
      Alerts.error('Korisnik sa ovim email-om već postoji!');
    }
  }
}
