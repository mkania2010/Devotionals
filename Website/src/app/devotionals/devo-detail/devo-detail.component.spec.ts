import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoDetailComponent } from './devo-detail.component';

describe('DevoDetailComponent', () => {
  let component: DevoDetailComponent;
  let fixture: ComponentFixture<DevoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
