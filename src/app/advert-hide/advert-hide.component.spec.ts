import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertHideComponent } from './advert-hide.component';

describe('AdvertHideComponent', () => {
  let component: AdvertHideComponent;
  let fixture: ComponentFixture<AdvertHideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertHideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertHideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
