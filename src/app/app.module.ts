import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { TailwindCalendarComponent } from './tailwind-calendar/tailwind-calendar.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    TailwindCalendarComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
