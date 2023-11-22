import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '@interfaces/user.interface';
// import { WD_INDICATORS } from 'src/assets/wd_indicators';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage {
  users$: Observable<User[]>;
  firestore: Firestore = inject(Firestore);
  ourData: string = '';

  constructor() {
    const userCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(userCollection) as Observable<User[]>;
  }

  ngOnInit() {
    this.initialConvertion();
  }
  initialConvertion() {
    // const convertedData = WD_INDICATORS;
    // console.log(convertedData);
  }
}
