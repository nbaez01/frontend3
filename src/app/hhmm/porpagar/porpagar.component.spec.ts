import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorpagarComponent } from './porpagar.component';

describe('PorpagarComponent', () => {
  let component: PorpagarComponent;
  let fixture: ComponentFixture<PorpagarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorpagarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorpagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
