import { Component, OnDestroy, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlgorithmsService } from '../services/algorithms.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  providers: [MessageService, AlgorithmsService, ConfirmationService],
  styleUrls: ['./id3.component.scss'],
})
export class Id3Component implements OnInit, OnDestroy {
  constructor(
    private messageService: MessageService,
    private algorithmsService: AlgorithmsService,
    private confirmationService: ConfirmationService
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
    if (this.dataInLocalStorage()) {
      this.nodes = JSON.parse(localStorage.getItem('id3Nodes') as string);
      this.edges = JSON.parse(localStorage.getItem('id3Edges') as string);
      this.center$.next(true);
      this.zoomToFit$.next(true);
    } else {
      this.loadExampleData();
    }
  }

  ngOnDestroy(): void {
    this.nodes = [];
    this.edges = [];
    this.updateLocalStorage();
  }

  dataInLocalStorage(): boolean {
    return (
      localStorage.getItem('id3Nodes') !== '[]' &&
      localStorage.getItem('id3Edges') !== '[]'
    );
  }

  loadExampleData(): void {
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
        this.updateLocalStorage();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Example data loaded successfully',
        });

        setTimeout(() => {
          this.zoomToFit$.next(true);
          this.center$.next(true);
        }, 500);
      });
  }

  updateLocalStorage(): void {
    localStorage.setItem('id3Nodes', JSON.stringify(this.nodes));
    localStorage.setItem('id3Edges', JSON.stringify(this.edges));
  }

  uploadHandler($event: any, form: any): void {
    for (const file of $event.files) {
      this.readFile(file);
    }
    form.clear();
  }

  readFile(file: any): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = reader.result!.toString().replaceAll('\r', '');
      if (!this.checkData(text)) {
        return;
      }
      this.algorithmsService.updateId3Data(text).subscribe((res) => {
        this.nodes = res['nodes'];
        this.edges = res['edges'];
        this.updateLocalStorage();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully. Updating graph...',
        });
        setTimeout(() => {
          this.zoomToFit$.next(true);
          this.update$.next(true);
          this.center$.next(true);
        }, 500);
      });
    };
    reader.readAsText(file);
  }

  checkData(data: any): boolean {
    if (data === undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Data is undefined',
      });
      return false;
    }

    if (data === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Data cannot be empty',
      });
      return false;
    }
    const dataArr = data.split('\n');
    const desiredLength = dataArr[0].split(',').length;
    for (let subarray of dataArr) {
      if (subarray.split(',').length !== desiredLength && subarray !== '') {
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
        this.updateLocalStorage();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully. Updating graph...',
        });
        setTimeout(() => {
          this.zoomToFit$.next(true);
          this.update$.next(true);
          this.center$.next(true);
        }, 500);
      });
  }

  showHelp(event: Event) {
    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        `Your data should be a newline separated list of comma separated values.\n\n` +
        `The first line should be the names of the attributes.\n\n` +
        `The last attribute should be the class attribute.\n\n` +
        `The class attribute should be the last attribute in each line.\n\n` +
        `The class attribute should be a binary attribute.\n`,
      icon: 'pi',
      acceptLabel: 'Ok',
      rejectVisible: false,
    });
  }
}
