import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrawingComponent } from './edit-drawing.component';

describe('EditDrawingComponent', () => {
  let component: EditDrawingComponent;
  let fixture: ComponentFixture<EditDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDrawingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
