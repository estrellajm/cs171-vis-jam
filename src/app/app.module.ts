import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { TailwindCalendarComponent } from './tailwind-calendar/tailwind-calendar.component';
import { RingsComponent } from './rings/rings.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    TailwindCalendarComponent,
    RingsComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
