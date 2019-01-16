import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagadosComponent } from './pagados.component';

describe('PagadosComponent', () => {
  let component: PagadosComponent;
  let fixture: ComponentFixture<PagadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
