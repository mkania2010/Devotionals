import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoItemComponent } from './devo-item.component';

describe('DevoItemComponent', () => {
  let component: DevoItemComponent;
  let fixture: ComponentFixture<DevoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
