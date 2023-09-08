import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/sandbox/bar/bar.component';
import { TailwindCalendarComponent } from './components/sandbox/tailwind-calendar/tailwind-calendar.component';
import { RingsComponent } from './components/rings/rings.component';
import { PathsComponent } from './components/paths/paths.component';
import { WiringTableComponent } from './components/wiring-table/wiring-table.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    TailwindCalendarComponent,
    RingsComponent,
    PathsComponent,
    WiringTableComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
