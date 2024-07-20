import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Draw } from 'ol/interaction';
import { DrawingService } from '../../services/drawing.service';
import { Polygon, LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  map!: Map;
  type: 'Polygon' | 'LineString' = 'LineString';
  isBrowser: boolean;

  constructor(private drawingService: DrawingService, @Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([37.41, 8.82]),
          zoom: 4
        })
      });

      const draw = new Draw({
        source: vectorSource,
        type: this.type
      });

      this.map.addInteraction(draw);

      draw.on('drawend', (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        if (geometry) {
          const type = geometry.getType();
          let coordinates: any;

          if (geometry instanceof Polygon) {
            coordinates = (geometry as Polygon).getCoordinates();
          } else if (geometry instanceof LineString) {
            coordinates = (geometry as LineString).getCoordinates();
          }

          if (coordinates) {
            this.drawingService.createDrawing({ type, data: coordinates }).subscribe();
          }
        }
      });
    }
  }

  addDrawing() {
    if (this.isBrowser) {
      const draw = new Draw({
        source: new VectorSource(),
        type: this.type
      });

      this.map.addInteraction(draw);

      draw.on('drawend', (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        if (geometry) {
          const type = geometry.getType();
          let coordinates: any;

          if (geometry instanceof Polygon) {
            coordinates = (geometry as Polygon).getCoordinates();
          } else if (geometry instanceof LineString) {
            coordinates = (geometry as LineString).getCoordinates();
          }

          if (coordinates) {
            this.drawingService.createDrawing({ type, data: coordinates }).subscribe();
          }
        }
      });
    }
  }
}
