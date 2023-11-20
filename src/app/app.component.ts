import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { BarsModule } from './bars/bars.module';
import { WD_INDICATORS } from '../assets/wd_indicators';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'CS171 Vis JAM';

  user$: Observable<User[]>;
  firestore: Firestore = inject(Firestore);
  ourData: string = '';

  constructor() {
    const userCollection = collection(this.firestore, 'users');
    this.user$ = collectionData(userCollection) as Observable<User[]>;
  }

  ngOnInit() {
    this.initialConvertion();
  }
  initialConvertion() {
    const convertedData = WD_INDICATORS;
    console.log(convertedData);
  }
}
