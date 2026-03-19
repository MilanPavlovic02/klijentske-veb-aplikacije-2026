import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-user',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  //prikazujemo podatke o trenutno ulogovanom korisniku
  public activUser = AuthService.getActiveUser();

  //promenjive za fromu promeni lozinku
  oldPassword = '';
  newPassword = '';
  passwordRepeat = '';

  constructor(private router: Router) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login']);
    }
  }

  //generisemo url za profilnu sliku
  getAvatarUrl() {
    return `https://ui-avatars.com/api/?name=${this.activUser?.firstName}+${this.activUser?.lastName}`;
  }

  //cuvamo izmene podataka na ternurnom korisniku
  updateUser() {
    Alerts.comfirm(
      'Da li ste sigurni da zelite da updejatate podatke korisnika ?',
      () => {
        AuthService.updateActiveUser(this.activUser!);
        Alerts.success('Korisnik uspesno promenjen');
      },
    );
  }

  //metoda za menjanje lozinke
  updatePassword() {
    Alerts.comfirm('Da li ste sigurni da zelite da promenite lozinku ?', () => {
      if (this.oldPassword != this.activUser?.password) {
        Alerts.error('Netacna stara lozinka');
        return;
      }

      if (this.newPassword != this.passwordRepeat) {
        Alerts.error('Sifre se ne podudaraju');
        return;
      }

      if (this.newPassword == this.activUser.password) {
        Alerts.error('Nova sifra ne moze da bude ista kao stara');
        return;
      }

      if (this.newPassword.length <= 5) {
        Alerts.error('Sifra mora biti duza od 5 karaktera');
        return;
      }

      AuthService.updateUserPassword(this.newPassword);
      Alerts.success('Sifra uspesno promenjena');
      AuthService.logout();
      this.router.navigate(['/login']);
    });
  }
}
