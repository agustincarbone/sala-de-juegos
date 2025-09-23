import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sala-de-juegos');
  firestore = inject(Firestore);

  items$: Observable<any[]>;

  constructor() {
    const collectionRef = collection(this.firestore, 'items');
    this.items$ = collectionData(collectionRef);
  }
}
