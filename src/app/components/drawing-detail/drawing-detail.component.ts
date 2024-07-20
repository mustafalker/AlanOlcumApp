import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-drawing-detail',
  templateUrl: './drawing-detail.component.html',
  styleUrls: ['./drawing-detail.component.css']
})
export class DrawingDetailComponent implements OnInit {
  drawing: any;

  constructor(private route: ActivatedRoute, private drawingService: DrawingService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.drawingService.getDrawing(+id).subscribe(data => {
        this.drawing = data;
      });
    } else {
      console.error('ID is null');
    }
  }

  saveDrawing(): void {
    if (this.drawing) {
      this.drawingService.saveDrawing(this.drawing).subscribe(
        (response: any) => {
          console.log('Drawing saved:', response);
        },
        (error: any) => {
          console.error('Error saving drawing:', error);
        }
      );
    } else {
      console.error('No drawing to save');
    }
  }
}
