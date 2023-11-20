import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/sandbox/bar/bar.component';
import { RingsComponent } from './components/sandbox/rings/rings.component';
import { PathsComponent } from './components/sandbox/paths/paths.component';
import { WiringTableComponent } from './components/wiring-table/wiring-table.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    RingsComponent,
    PathsComponent,
    WiringTableComponent,
    provideFirebaseApp(() => initializeApp({"projectId":"cs171-vis-jam","appId":"1:311393750868:web:e46baba56c4a5136b342c1","storageBucket":"cs171-vis-jam.appspot.com","apiKey":"AIzaSyCJRzZ7u74dvAkXcP8MJ_geLnIm6LKo6G4","authDomain":"cs171-vis-jam.firebaseapp.com","messagingSenderId":"311393750868"})),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
