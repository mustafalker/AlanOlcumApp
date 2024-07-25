import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';
import { AuthService } from '../../Auth Services/auth.service';

@Component({
  selector: 'app-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css']
})
export class DrawingListComponent implements OnInit {
  drawings: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private drawingService: DrawingService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDrawings();
    this.isAdmin = this.authService.isAdmin();
  }

  loadDrawings(): void {
    this.drawingService.getDrawings().subscribe(
      (data: any[]) => {
        this.drawings = data;
      },
      error => {
        console.error('Error fetching drawings:', error);
      }
    );
  }

  editDrawing(id: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/edit-drawing', id]);
    }
  }

  deleteDrawing(id: number): void {
    this.drawingService.deleteDrawing(id).subscribe(
      () => {
        this.drawings = this.drawings.filter(drawing => drawing.id !== id);
      },
      error => {
        console.error('Error deleting drawing:', error);
      }
    );
  }
}
