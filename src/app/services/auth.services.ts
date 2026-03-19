import { UserModel } from '../../models/user.model';

//konatante za kljuceve u localStorage
const USERS = 'users';
const ACTIVE = 'active';

//dohvatamo sve korisnike iz memorije
//ako priv put pokrecemo kreiramo testnog korisnika
export class AuthService {
  static getUsers(): UserModel[] {
    const baseUser: UserModel = {
      email: 'user@example.com',
      password: 'user123',
      phone: '0101010',
      address: 'marka oreskovica',
      firstName: 'Example',
      lastName: 'User',
      orders: [],
    };
    if (localStorage.getItem(USERS) == null) {
      localStorage.setItem(USERS, JSON.stringify([baseUser]));
    }

    return JSON.parse(localStorage.getItem(USERS)!);
  }

  //proveravamo email i loziki i postavljamo email kao ACTIVE
  static login(email: string, password: string) {
    const users = this.getUsers();
    for (let u of users) {
      if (u.email === email && u.password === password) {
        localStorage.setItem(ACTIVE, email);
        return true;
      }
    }
    return false;
  }

  //vracamo ceo objekat ulogovanog korisnika
  static getActiveUser(): UserModel | null {
    const users = this.getUsers();
    for (let u of users) {
      if (u.email === localStorage.getItem(ACTIVE)) {
        return u;
      }
    }

    return null;
  }

  //azuriramo podatke trenuknog korisnika
  static updateActiveUser(newUserData: UserModel) {
    const users = this.getUsers();
    for (let u of users) {
      if (u.email === localStorage.getItem(ACTIVE)) {
        u.firstName = newUserData.firstName;
        u.lastName = newUserData.lastName;
        u.address = newUserData.address;
        u.phone = newUserData.phone;
      }
    }
    localStorage.setItem(USERS, JSON.stringify(users));
  }

  //Menjanje lozinke
  static updateUserPassword(newPassword: string) {
    const users = this.getUsers();
    for (let u of users) {
      if (u.email === localStorage.getItem(ACTIVE)) {
        u.password = newPassword;
      }
    }
    localStorage.setItem(USERS, JSON.stringify(users));
  }

  //odjavljivanje korisnika
  static logout() {
    localStorage.removeItem(ACTIVE);
  }

  //registracija novog
  static register(newUser: UserModel): boolean {
    const users = this.getUsers();
    const exists = users.find((u) => u.email === newUser.email);
    if (exists) {
      return false;
    }
    users.push(newUser);
    localStorage.setItem(USERS, JSON.stringify(users));
    return true;
  }

  //dodavanje zavrsen proces kupovine u istoriju korisnika
  static addOrderToActiveUser(order: any) {
    const users = this.getUsers();
    const activeEmail = localStorage.getItem(ACTIVE);
    const userIndex = users.findIndex((u) => u.email === activeEmail);

    if (userIndex !== -1) {
      if (!users[userIndex].orders) {
        users[userIndex].orders = [];
      }

      users[userIndex].orders.unshift(order);

      localStorage.setItem(USERS, JSON.stringify(users));
      return true;
    }
    return false;
  }
}
