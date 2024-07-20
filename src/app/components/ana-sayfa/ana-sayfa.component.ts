import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component'; // MapComponent'i içe aktarın
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';


@Component({
  selector: 'app-ana-sayfa',
  templateUrl: './ana-sayfa.component.html',
  styleUrl: './ana-sayfa.component.css',
})
export class AnaSayfaComponent {
  type: 'Polygon' | 'LineString' = 'Polygon';
  addDrawing() {
    const draw = new Draw({
      source: new VectorSource(),
      type: this.type
    });
  }
}
