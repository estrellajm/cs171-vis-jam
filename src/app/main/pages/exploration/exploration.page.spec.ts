import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationPage } from './exploration.page';

describe('ExplorationPage', () => {
  let component: ExplorationPage;
  let fixture: ComponentFixture<ExplorationPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExplorationPage]
    });
    fixture = TestBed.createComponent(ExplorationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
