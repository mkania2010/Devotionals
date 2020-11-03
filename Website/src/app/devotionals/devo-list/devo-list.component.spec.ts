import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoListComponent } from './devo-list.component';

describe('DevoListComponent', () => {
  let component: DevoListComponent;
  let fixture: ComponentFixture<DevoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
