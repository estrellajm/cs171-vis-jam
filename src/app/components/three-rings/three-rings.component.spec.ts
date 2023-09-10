import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeRingsComponent } from './three-rings.component';

describe('ThreeRingsComponent', () => {
  let component: ThreeRingsComponent;
  let fixture: ComponentFixture<ThreeRingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThreeRingsComponent]
    });
    fixture = TestBed.createComponent(ThreeRingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
