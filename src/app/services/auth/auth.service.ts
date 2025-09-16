import { Injectable, inject, signal, NgZone } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private zone = inject(NgZone);
  currentUser = signal<User | null>(null);
  authStatusChecked: any;

  constructor() {
    onAuthStateChanged(this.auth, user => {
      this.zone.run(() => {
        this.currentUser.set(user);
      });
    })
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential;
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
