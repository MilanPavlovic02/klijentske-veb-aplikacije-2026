import { Component, signal } from '@angular/core';
import axios from 'axios';
import { ToysModel } from '../../models/toy.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  toys = signal<ToysModel[]>([])

  constructor() { 
    axios.get('https://toy.pequla.com/api/toy')
    .then(rsp =>this.toys.set(rsp.data))
  }

}
