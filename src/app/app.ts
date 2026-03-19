import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.services';
import { Alerts } from './alerts';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLinkWithHref,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public authService = AuthService;

  constructor(private router: Router) {}

  //dohvatamo aktivnog korisnika
  activeUser = AuthService.getActiveUser();

  //metoda za odjavu korisnika
  doLogout() {
    Alerts.comfirm('Da zelite da se izlogujete ?', () => {
      AuthService.logout();
      this.router.navigate(['/login']);
    });
  }
}
