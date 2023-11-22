import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'cs171-vis-jam',
        appId: '1:311393750868:web:e46baba56c4a5136b342c1',
        storageBucket: 'cs171-vis-jam.appspot.com',
        apiKey: 'AIzaSyCJRzZ7u74dvAkXcP8MJ_geLnIm6LKo6G4',
        authDomain: 'cs171-vis-jam.firebaseapp.com',
        messagingSenderId: '311393750868',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
