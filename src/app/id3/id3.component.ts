import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlgorithmsService } from '../services/algorithms.service';
import { catchError } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./id3.component.scss'],
})
export class Id3Component implements OnInit, OnDestroy {
  private zoom: any;

  constructor(
    private messageService: MessageService,
    private algorithmsService: AlgorithmsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (this.dataInLocalStorage()) {
      document.getElementById('container')!.innerHTML = localStorage.getItem(
        'id3_data'
      )! as string;
      this.initializePanAndZoom();
    } else {
      this.loadExampleData();
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem('id3_data', '');
  }

  initializePanAndZoom(): void {
    const container = d3.select(document.getElementById('container')!);
    const element = document.getElementById('content')!;
    const content = d3.select(element);

    container.on('zoom', null);

    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.right = '0';
    element.style.bottom = '0';
    element.style.width = '95%';
    element.style.height = '95%';
    element.style.margin = 'auto';
    element.style.objectFit = 'contain';


    this.zoom = d3.zoom().on('zoom', (event) => {
      const { x, y, k } = event.transform;
      content.style('transform', `translate(${x}px, ${y}px) scale(${k})`);
    });

    container.call(this.zoom, d3.zoomIdentity.scale(0.95));
    this.resetView();
  }

  resetView(): void {
    const container = d3.select(document.getElementById('container')!);
    const containerRect = container.node()!.getBoundingClientRect();
    const scale = 0.95;

    const initialTransform = d3.zoomIdentity
      .scale(scale)
      .translate(
        (containerRect.width - containerRect.width) / 2,
        (containerRect.height - containerRect.height) / 2
      );

    container
      .transition()
      .duration(750)
      .call(this.zoom.transform, initialTransform);
  }

  dataInLocalStorage(): boolean {
    return (
      localStorage.getItem('id3_data') !== ''
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
        document.getElementById('container')!.innerHTML = data.graph;
        this.initializePanAndZoom();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Example data loaded successfully',
        });
      });
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
        document.getElementById('container')!.innerHTML = res.graph;
        localStorage.setItem('id3_data', res.graph);
        this.initializePanAndZoom();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully. Updating graph...',
        });
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
        document.getElementById('container')!.innerHTML = res.graph;
        localStorage.setItem('id3_data', res.graph);
        this.initializePanAndZoom();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data loaded successfully. Updating graph...',
        });
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
