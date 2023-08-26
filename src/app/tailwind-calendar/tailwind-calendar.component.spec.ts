import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailwindCalendarComponent } from './tailwind-calendar.component';

describe('TailwindCalendarComponent', () => {
  let component: TailwindCalendarComponent;
  let fixture: ComponentFixture<TailwindCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TailwindCalendarComponent]
    });
    fixture = TestBed.createComponent(TailwindCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
