import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
