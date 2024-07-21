import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../../services/drawing.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Auth Services/auth.service'; 

@Component({
  selector: 'app-drawing-detail',
  templateUrl: './drawing-detail.component.html',
  styleUrls: ['./drawing-detail.component.css']
})
export class DrawingDetailComponent implements OnInit {
  drawing: any;
  isAdmin: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private drawingService: DrawingService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isAdmin = this.authService.isAdmin(); // Kullanıcının admin olup olmadığını kontrol edin

    if (id) {
      this.drawingService.getDrawing(+id).subscribe(data => {
        this.drawing = data;
      });
    } else {
      console.error('ID is null');
    }
  }

  saveDrawing(): void {
    if (this.isAdmin) { // Yalnızca admin olan kullanıcıların kaydetmesi
      if (this.drawing) {
        this.drawingService.saveDrawing(this.drawing).subscribe(
          (response: any) => {
            console.log('Drawing saved:', response);
            this.toastr.success('Drawing saved successfully.');
          },
          (error: any) => {
            console.error('Error saving drawing:', error);
            this.toastr.error('Error saving drawing.');
          }
        );
      } else {
        console.error('No drawing to save');
      }
    } else {
      this.toastr.error('You do not have permission to save this drawing.');
    }
  }
}
