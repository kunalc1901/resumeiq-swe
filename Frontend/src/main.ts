import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    // Angular 22 defaults to zoneless change detection; this app is written
    // against NgZone-based change detection (plain component fields updated
    // from async callbacks), so opt back into the zone scheduler explicitly.
    applicationProviders: [provideZoneChangeDetection()],
  })
  .catch((err) => console.error(err));
