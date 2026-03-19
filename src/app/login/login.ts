import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.services';
import { Router, RouterLink } from '@angular/router';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //promenjive povezane na input polja
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    //proveravamo da li postoji ulogovan korisnik i vracamo ga na pocetnu stranu
    if (AuthService.getActiveUser()) {
      router.navigate(['/']);
    }
  }

  //metoda koja se pozava na klik dugmeta
  doLogin() {
    //proveravamo podatke, i prebacujemo korisnika na home
    if (AuthService.login(this.email, this.password)) {
      this.router.navigate(['/']);
      return;
    }
    Alerts.error('Neispravna sifra ili email !');
  }
}
