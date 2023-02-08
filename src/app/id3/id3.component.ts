import {Component, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import axios from "axios";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  styleUrls: ['./id3.component.css']
})
export class Id3Component implements OnInit {

  nodes: Node[] = [];
  edges: Edge[] = [];
  data: any = {};

  layoutSettings = {
    orientation: 'TB',
    nodePadding: 15,
  };

  layout: string | Layout = 'dagre';
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];

  // line interpolation
  curveType: string = 'Bundle';
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before',
  ];

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = false;

  autoZoom: boolean = false;
  autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  setInterpolationType(curveType: any) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  setLayout(layoutName: string): void {
    const layout = this.layouts.find((l) => l.value === layoutName);
    this.layout = layoutName;
  }

  ngOnInit(): void {
    axios.get("http://localhost:8000/api/get_example_id3")
      .then((response) => {
        this.nodes = response.data['nodes'];
        this.edges = response.data['edges'];
        this.initPage();
        this.setInterpolationType(this.curveType);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  initPage() {
    console.log(this.nodes);
    console.log(this.edges);
  }
}
