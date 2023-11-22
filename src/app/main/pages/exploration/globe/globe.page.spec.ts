import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobePage } from './globe.page';

describe('GlobePage', () => {
  let component: GlobePage;
  let fixture: ComponentFixture<GlobePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobePage]
    });
    fixture = TestBed.createComponent(GlobePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
