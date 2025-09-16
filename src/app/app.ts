import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
