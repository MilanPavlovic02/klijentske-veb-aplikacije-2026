import axios from 'axios';
import { ToysModel } from '../../models/toy.model';

const client = axios.create({
  //osnovna adres api-ja
  baseURL: 'https://toy.pequla.com/api',
  headers: {
    Accept: 'application/json',
    'X-Name': 'KVA_2026/dev',
  },
  //definisanje odgovora da je uspesan
  validateStatus(status) {
    return status === 200;
  },
});

export class ToyService {
  //povlacimo lisut svih igracaka
  static async getToys() {
    return await client.get<ToysModel[]>('/toy');
  }

  //povlacimo podatke o specificnoj igracki na osnovu id-a
  static async getToysById(id: number) {
    return await client.get<ToysModel>('/toy/' + id);
  }
}
