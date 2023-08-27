import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingsComponent } from './rings.component';

describe('RingsComponent', () => {
  let component: RingsComponent;
  let fixture: ComponentFixture<RingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RingsComponent]
    });
    fixture = TestBed.createComponent(RingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
