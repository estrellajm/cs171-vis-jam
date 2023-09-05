import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/bar/bar.component';
import { TailwindCalendarComponent } from './components/tailwind-calendar/tailwind-calendar.component';
import { RingsComponent } from './components/rings/rings.component';
import { PathsComponent } from './components/paths/paths.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    TailwindCalendarComponent,
    RingsComponent,
    PathsComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
