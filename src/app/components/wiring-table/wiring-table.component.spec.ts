import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiringTableComponent } from './wiring-table.component';

describe('WiringTableComponent', () => {
  let component: WiringTableComponent;
  let fixture: ComponentFixture<WiringTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WiringTableComponent]
    });
    fixture = TestBed.createComponent(WiringTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
