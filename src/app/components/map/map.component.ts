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

  ngOnInit() {
    this.initializeMap();
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
  }

  addPolygon() {
    this.map.removeInteraction(this.drawInteraction);
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: 'Polygon',
    });
    this.map.addInteraction(this.drawInteraction);
  }

  addLineString() {
    this.map.removeInteraction(this.drawInteraction);
    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: 'LineString',
    });
    this.map.addInteraction(this.drawInteraction);
  }

  resetMap() {
    this.vectorSource.clear();
    this.map.getView().setCenter(fromLonLat([0, 0]));
    this.map.getView().setZoom(2);
  }

  cancelDrawing() {
    this.map.removeInteraction(this.drawInteraction);
    // İptal edilen çizimi yeniden etkinleştirmek için etkileşimi tekrar ekleyin
    this.map.addInteraction(this.drawInteraction);
  }
}
