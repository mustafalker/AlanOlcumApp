import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private apiUrl = 'http://localhost:3000/drawings';

  constructor(private http: HttpClient) {}

  getDrawings(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHttpOptions());
  }

  getDrawing(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createDrawing(drawing: any): Observable<any> {
    return this.http.post(this.apiUrl, drawing, this.getHttpOptions());
  }

  updateDrawing(id: number, drawing: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, drawing, this.getHttpOptions());
  }

  deleteDrawing(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  saveDrawing(drawing: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${drawing.id}`, drawing, this.getHttpOptions());
  }

  private getHttpOptions() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers: headers };
  }
}
