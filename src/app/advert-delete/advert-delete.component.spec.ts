import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertDeleteComponent } from './advert-delete.component';

describe('AdvertDeleteComponent', () => {
  let component: AdvertDeleteComponent;
  let fixture: ComponentFixture<AdvertDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
