import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysellbuttonComponent } from './buysellbutton.component';

describe('BuysellbuttonComponent', () => {
  let component: BuysellbuttonComponent;
  let fixture: ComponentFixture<BuysellbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuysellbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuysellbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
