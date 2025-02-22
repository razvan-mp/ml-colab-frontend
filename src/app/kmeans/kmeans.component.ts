import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { KmeansEnvironmentVars } from '../vars/kmeans-environment-vars';
import { AppComponent } from '../app.component';
import { AlgorithmsService } from '../services/algorithms.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-kmeans',
  providers: [MessageService, ConfirmationService],
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.scss'],
})
export class KmeansComponent implements OnInit, OnDestroy {
  @ViewChild('pointInput') pointInput!: ElementRef;
  @ViewChild('centroidInput') centroidInput!: ElementRef;

  public graph = {
    data: [] as any,
    layout: {
      template: KmeansEnvironmentVars.template,
      font: {
        family: KmeansEnvironmentVars.fontFamily,
        size: KmeansEnvironmentVars.fontSize,
      },
    },
  };

  public customCentroids: boolean = true;

  constructor(
    private messageService: MessageService,
    private algorithmsService: AlgorithmsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('kmeans')) {
      this.graph.data = JSON.parse(localStorage.getItem('kmeans') as string);
    } else {
      this.initPage();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('kmeans');
  }

  initPage() {
    this.algorithmsService
      .getExampleKmeans()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error getting example data',
          });
          return error;
        })
      )
      .subscribe((data: any) => {
        this.updateGraphData(JSON.parse(data));
        console.log(JSON.parse(data));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Example data loaded successfully',
        });
      });
    AppComponent.hidePlotly();
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
      let text: any = reader.result!.toString().replaceAll('\r', '');

      let centroids = '';
      let points = '';

      if (text.includes(';')) {
        text = text.split(';');
        centroids = text[0];
        points = text[1];
      } else {
        points = text;
      }

      let payload: any = { points: points };

      if (centroids !== '') {
        centroids = centroids.replace(/\n$/, '');
        payload['centroids'] = centroids;
      } else {
        payload['options'] = 'random';
      }

      console.log(payload);

      this.algorithmsService
        .updateKmeansData(payload)
        .pipe(
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error running algorithm',
            });
            return error;
          })
        )
        .subscribe((data) => {
          this.updateGraphData(JSON.parse(data));
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Example data loaded',
          });
        });
    };
    reader.readAsText(file);
  }

  updateGraphData(data: any) {
    this.graph.data = [];
    for (let centroidIndex = 0; centroidIndex < data.length; centroidIndex++) {
      const color = KmeansEnvironmentVars.colors[centroidIndex];
      const centroid = data[centroidIndex];
      const x = centroid.x;
      const y = centroid.y;

      this.graph.data.push({
        x: [x],
        y: [y],
        r: 20,
        type: 'scatter',
        mode: 'markers',
        marker: { color: color, size: 20, line: { color: 'black', width: 2 } },
        name: 'Centroid ' + (centroidIndex + 1),
      });

      const points = centroid.points;

      for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
        const point = points[pointIndex];
        const x = point.x;
        const y = point.y;

        this.graph.data.push({
          x: [x],
          y: [y],
          type: 'scatter',
          mode: 'markers',
          marker: {
            color: `${color}`,
            size: 10,
            line: { color: 'black', width: 2 },
          },
          name: 'Point ' + (pointIndex + 1),
        });
      }
    }
    localStorage.setItem('kmeans', JSON.stringify(this.graph.data));
  }

  updateData($event: SubmitEvent, kmeansInput: HTMLFormElement) {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(kmeansInput) as any) as any;

    let payload: any = { points: data['points'] };

    if (data['points'] === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter points',
      });
      return;
    }

    if (this.customCentroids) {
      payload['centroids'] = data['centroids'];
      if (data['centroids'] === '') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter centroids',
        });
        return;
      }
    }

    this.algorithmsService
      .updateKmeansData(data)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error running algorithm',
          });
          return error;
        })
      )
      .subscribe((data) => {
        this.updateGraphData(JSON.parse(data));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Example data loaded',
        });
      });
  }

  updateUseCentroidOption() {
    this.customCentroids = !this.customCentroids;
    if (!this.customCentroids) {
      document.getElementById('centroid-input')!.innerText = '';
    }
  }

  addRandomPoints() {
    for (let pointIndex = 0; pointIndex < 15; pointIndex++) {
      this.graph.data.push({
        x: [Math.floor(Math.random() * 200) - 100],
        y: [Math.floor(Math.random() * 200) - 100],
        r: 10,
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: 'white',
          size: 10,
          line: { color: 'black', width: 2 },
        },
        name: 'Point',
      });
    }
  }

  removeAllPoints() {
    this.graph.data = this.graph.data.filter((data: any) => {
      return !data.name.includes('Point');
    });
  }

  addRandomCentroids() {
    for (let centroidIndex = 0; centroidIndex < 3; centroidIndex++) {
      this.graph.data.push({
        x: [Math.floor(Math.random() * 200) - 100],
        y: [Math.floor(Math.random() * 200) - 100],
        r: 20,
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: 'white',
          size: 20,
          line: { color: 'black', width: 2 },
        },
        name: 'Centroid',
      });
    }
  }

  removeAllCentroids() {
    this.graph.data = this.graph.data.filter((data: any) => {
      return !data.name.includes('Centroid');
    });
  }

  runKmeans() {
    let data: any = {};

    const points = this.graph.data
      .filter((data: any) => {
        return data.name.includes('Point');
      })
      .map((data: any) => {
        return data.x[0] + ',' + data.y[0];
      })
      .join('\n');

    const centroids = this.graph.data
      .filter((data: any) => {
        return data.name.includes('Centroid');
      })
      .map((data: any) => {
        return data.x[0] + ',' + data.y[0];
      })
      .join('\n');

    data.points = points;
    if (centroids.length > 0) {
      data.centroids = centroids;
    }

    this.algorithmsService
      .updateKmeansData(data)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error running algorithm',
          });
          return error;
        })
      )
      .subscribe((data) => {
        this.updateGraphData(JSON.parse(data));
        console.log(JSON.parse(data));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Updated graph data',
        });
      });
  }

  showHelp(event: Event) {
    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Your data must be a newline separated list of points in the form x,y.\n
        Your centroids must be a newline separated list of points in the form x,y.\n
        You can also use the random buttons to generate random points and centroids.\n
        Your CSV must have the centroids first (if used), a ; character, and then the points.`,
      acceptLabel: 'Ok',
      rejectVisible: false,
    });
  }

  private randomIntBetween(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private rounded(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  getRandomData() {
    let points = '';
    let centroids = '';
    let maxPointIndex = this.randomIntBetween(5, 50);

    for (let index = 0; index < maxPointIndex; index++) {
      points += this.rounded(this.randomBetween(-100, 100)) + ',';
      points += this.rounded(this.randomBetween(-100, 100)) + '\n';
    }

    let maxCentroidIndex = this.randomIntBetween(
      1,
      Math.floor(maxPointIndex / 2)
    );

    for (let index = 0; index < maxCentroidIndex; index++) {
      centroids += this.rounded(this.randomBetween(-40, 40)) + ',';
      centroids += this.rounded(this.randomBetween(-100, 100)) + '\n';
    }

    this.pointInput.nativeElement.value = points;

    if (this.customCentroids) {
      this.centroidInput.nativeElement.value = centroids;
    } else {
      this.centroidInput.nativeElement.value = '';
    }
  }
}
