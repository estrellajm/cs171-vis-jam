import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'cs171-vis-jam',
          appId: '1:311393750868:web:e46baba56c4a5136b342c1',
          storageBucket: 'cs171-vis-jam.appspot.com',
          apiKey: 'AIzaSyCJRzZ7u74dvAkXcP8MJ_geLnIm6LKo6G4',
          authDomain: 'cs171-vis-jam.firebaseapp.com',
          messagingSenderId: '311393750868',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
