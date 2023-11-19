import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CS171 Vis JAM';

  user$: Observable<User[]>;
  firestore: Firestore = inject(Firestore);

  constructor() {
    const userCollection = collection(this.firestore, 'users');
    this.user$ = collectionData(userCollection) as Observable<User[]>;
  }
}
