import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Fill, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import { LineString, Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { DrawingService } from '../../services/drawing.service';
import { AuthService } from '../../Auth Services/auth.service';

interface Drawing {
  coordinates: number[][] | number[][][];
  type: 'Polygon' | 'LineString';
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: Map;
  vectorSource!: VectorSource;
  vectorLayer!: VectorLayer<any>;
  drawInteraction!: Draw;
  modifyInteraction!: Modify;
  snapInteraction!: Snap;
  isAdmin: boolean = false;
  modificationPending: boolean = false;
  isSaveButtonVisible: boolean = false; 

  constructor(private drawingService: DrawingService, private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.initializeMap();
    this.loadDrawings();
  }

  initializeMap() {
    this.vectorSource = new VectorSource({ wrapX: false });

    this.vectorLayer = new VectorLayer<any>({
      source: this.vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
      }),
    });

    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    this.addInteractions();
  }

  addInteractions() {
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: 'Polygon',
    });

    this.modifyInteraction = new Modify({
      source: this.vectorSource,
    });

    this.snapInteraction = new Snap({
      source: this.vectorSource,
    });

    this.map.addInteraction(this.drawInteraction);
    this.map.addInteraction(this.modifyInteraction);
    this.map.addInteraction(this.snapInteraction);

    this.drawInteraction.on('drawend', (event) => {
      const feature = event.feature;
      this.saveDrawing(feature);
    });

    this.modifyInteraction.on('modifyend', (event) => {
      const features = event.features.getArray();
      this.modificationPending = true;
      this.isSaveButtonVisible = true; // Save button görünür yapma işlemi
      features.forEach(feature => {
        feature.set('modified', true);
      });
    });
  }

  loadDrawings() {
    if (this.isAdmin) {
      this.drawingService.getAllDrawingsAdmin().subscribe((drawings: Drawing[]) => {
        this.addDrawingsToMap(drawings);
      });
    } else {
      this.drawingService.getDrawings().subscribe((drawings: Drawing[]) => {
        this.addDrawingsToMap(drawings);
      });
    }
  }

  addDrawingsToMap(drawings: Drawing[]) {
    drawings.forEach(drawing => {
      let geometry;
      if (drawing.type === 'Polygon') {
        geometry = new Polygon(drawing.coordinates as number[][][]);
      } else if (drawing.type === 'LineString') {
        geometry = new LineString(drawing.coordinates as number[][]);
      }
      const feature = new Feature({ geometry });
      this.vectorSource.addFeature(feature);
    });
  }

  saveDrawing(feature: Feature) {
    const geometry = feature.getGeometry();
    if (geometry && (geometry instanceof Polygon || geometry instanceof LineString)) {
      const coordinates = geometry.getCoordinates();
      const drawing: Drawing = {
        coordinates,
        type: geometry.getType() as 'Polygon' | 'LineString'
      };
  
      // Log data before sending to backend
      console.log('Sending drawing to backend:', drawing);
  
      this.drawingService.createDrawing(drawing).subscribe(
        (response: any) => {
          console.log('Drawing saved:', response);
        },
        (error: any) => {
          console.error('Error saving drawing:', error);
        }
      );
    } else {
      console.error('Unsupported geometry type or undefined geometry:', geometry?.getType());
    }
  }

  saveModifications() {
    const modifiedFeatures = this.vectorSource.getFeatures().filter(feature => feature.get('modified'));
    modifiedFeatures.forEach(feature => {
      const geometry = feature.getGeometry();
      if (geometry && (geometry instanceof Polygon || geometry instanceof LineString)) {
        const coordinates = geometry.getCoordinates();
        const drawing: Drawing = {
          coordinates,
          type: geometry.getType() as 'Polygon' | 'LineString'
        };

        console.log('Saving modified drawing to backend:', drawing);
  
        const featureId = feature.getId();
        if (typeof featureId === 'number') {
          this.drawingService.saveDrawing(featureId, drawing).subscribe(
            (response: any) => {
              console.log('Modified drawing saved:', response);
              feature.set('modified', false); 
            },
            (error: any) => {
              console.error('Error saving modified drawing:', error);
            }
          );
        } else {
          console.error('Feature ID is not a number:', featureId);
        }
      }
    });
    this.modificationPending = false;
    this.isSaveButtonVisible = false; // Save button gizleme işlemi
  }

  addPolygon() {
    this.map.removeInteraction(this.drawInteraction);
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: 'Polygon',
    });
    this.map.addInteraction(this.drawInteraction);
  
    this.drawInteraction.on('drawend', (event) => {
      const feature = event.feature;
      this.saveDrawing(feature);
    });
  }
  
  addLineString() {
    this.map.removeInteraction(this.drawInteraction);
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: 'LineString',
    });
    this.map.addInteraction(this.drawInteraction);
  
    this.drawInteraction.on('drawend', (event) => {
      const feature = event.feature;
      this.saveDrawing(feature);
    });
  }

  resetMap() {
    this.vectorSource.clear();
    this.map.getView().setCenter(fromLonLat([0, 0]));
    this.map.getView().setZoom(2);
  }

  cancelDrawing() {
    this.map.removeInteraction(this.drawInteraction);
    this.map.addInteraction(this.drawInteraction);
  }

  saveChanges() {
    this.saveModifications();
  }
}
