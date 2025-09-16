import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "sala-de-juegos-e90ea", appId: "1:828049288463:web:1844662353db5c926ea27a", storageBucket: "sala-de-juegos-e90ea.firebasestorage.app", apiKey: "AIzaSyC5623XcwWxg_2i2UvnkefBttDfFsGd7C8", authDomain: "sala-de-juegos-e90ea.firebaseapp.com", messagingSenderId: "828049288463" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "sala-de-juegos-e90ea", appId: "1:828049288463:web:1844662353db5c926ea27a", storageBucket: "sala-de-juegos-e90ea.firebasestorage.app", apiKey: "AIzaSyC5623XcwWxg_2i2UvnkefBttDfFsGd7C8", authDomain: "sala-de-juegos-e90ea.firebaseapp.com", messagingSenderId: "828049288463" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
