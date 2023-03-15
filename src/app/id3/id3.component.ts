import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AlgorithmsService } from '../services/algorithms.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  providers: [MessageService, AlgorithmsService],
  styleUrls: ['./id3.component.scss'],
})
export class Id3Component implements OnInit {
  constructor(
    private messageService: MessageService,
    private algorithmsService: AlgorithmsService
  ) {}

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
    this.algorithmsService
      .getExampleId3()
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading example data',
          });
          return err;
        })
      )
      .subscribe((data: any) => {
        this.nodes = data['nodes'];
        this.edges = data['edges'];

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully',
        });

        setTimeout(() => {
          this.update$.next(true);
          this.center$.next(true);
          this.zoomToFit$.next(true);
        }, 500);
      });
  }

  checkData(data: any): boolean {
    if (data === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Data is empty',
      });
      return false;
    }
    const dataArr = data.split('\n');
    const desiredLength = dataArr[0].split(',').length;
    for (let subarray of dataArr) {
      if (subarray.split(',').length !== desiredLength) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data is not in correct format',
        });
        return false;
      }
    }
    return true;
  }

  submitGraphValues($event: any, graphValues: any) {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(graphValues as any) as any)[
      'data'
    ];
    if (!this.checkData(data)) return;
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Sending data to server',
    });
    this.algorithmsService
      .updateId3Data(data)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error sending data to server',
          });
          return err;
        })
      )
      .subscribe((res) => {
        this.nodes = res['nodes'];
        this.edges = res['edges'];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully. Updating graph...',
        });
        setTimeout(() => {
          this.update$.next(true);
          this.center$.next(true);
          this.zoomToFit$.next(true);
        }, 500);
      });
  }
}
