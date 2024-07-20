import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css']
})
export class DrawingListComponent implements OnInit {
  drawings: any[] = [];

  constructor(private drawingService: DrawingService, private router: Router) {}

  ngOnInit(): void {
    this.drawingService.getDrawings().subscribe(data => {
      this.drawings = data;
    });
  }

  editDrawing(id: number): void {
    this.router.navigate(['/drawing', id]);
  }

  deleteDrawing(id: number): void {
    this.drawingService.deleteDrawing(id).subscribe(() => {
      this.drawings = this.drawings.filter(drawing => drawing.id !== id);
    }, error => {
      console.error('Error deleting drawing:', error);
    });
  }
}
