import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationPage } from './correlation.page';

describe('CorrelationPage', () => {
  let component: CorrelationPage;
  let fixture: ComponentFixture<CorrelationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CorrelationPage]
    });
    fixture = TestBed.createComponent(CorrelationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
