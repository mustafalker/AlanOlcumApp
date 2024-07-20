import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingListComponent } from './drawing-list.component';

describe('DrawingListComponent', () => {
  let component: DrawingListComponent;
  let fixture: ComponentFixture<DrawingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
