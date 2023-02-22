import {Component, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import axios, {GenericHTMLFormElement} from "axios";
import { Subject } from 'rxjs';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  providers: [MessageService],
  styleUrls: ['./id3.component.scss']
})
export class Id3Component implements OnInit {

  constructor(private messageService: MessageService) {
  }

  nodes: Node[] = [];
  edges: Edge[] = [];
  data: any = {};

  layoutSettings = {
    orientation: 'TB',
    nodePadding: '10',
  };
  layout: string | Layout = 'dagre';
  curve: any = shape.curveBundle.beta(1);
  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = true;

  autoZoom: boolean = true;
  autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  ngOnInit(): void {
    axios.get("http://localhost:8000/api/get_example_id3")
      .then((response) => {
        this.nodes = response.data['nodes'];
        this.edges = response.data['edges'];
        setTimeout(() => {
          this.center$.next(true);
          this.zoomToFit$.next(true);
        }, 500);
        this.messageService.add({severity:'info', summary:'Success', detail:'Data loaded successfully'});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkData(data: any): boolean {
    if (data === '') {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Data is empty'});
      return false;
    }
    const dataArr = data.split('\n');
    const desiredLength = dataArr[0].split(',').length;
    for (let subarray of dataArr) {
      if (subarray.split(',').length !== desiredLength) {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Data is not in correct format'});
        return false;
      }
    }
    return true;
  }

  submitGraphValues($event: any, graphValues: any) {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(graphValues as any) as any)['data'];
    if (!this.checkData(data)) return;
    this.messageService.add({severity:'info', summary:'Success', detail:'Sending data to server'})
    axios.post("http://localhost:8000/api/id3/", data)
    .then((res) => {
      this.nodes = res.data['nodes'];
      this.edges = res.data['edges'];
      this.messageService.add({severity:'success', summary:'Success', detail:'Data loaded successfully. Updating graph...'});
      setTimeout(() => {
        this.update$.next(true);
        this.center$.next(true);
        this.zoomToFit$.next(true);
      }, 500);
    })
    .catch((error) => {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error getting ID3 tree data'});
    })
  }
}
