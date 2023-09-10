import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/sandbox/bar/bar.component';
import { TailwindCalendarComponent } from './components/sandbox/tailwind-calendar/tailwind-calendar.component';
import { RingsComponent } from './components/sandbox/rings/rings.component';
import { PathsComponent } from './components/sandbox/paths/paths.component';
import { WiringTableComponent } from './components/wiring-table/wiring-table.component';
import { ThreeRingsComponent } from './components/three-rings/three-rings.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BarComponent,
    TailwindCalendarComponent,
    RingsComponent,
    PathsComponent,
    WiringTableComponent,
    ThreeRingsComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
