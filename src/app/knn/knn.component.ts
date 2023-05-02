import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { AlgorithmsService } from '../services/algorithms.service';
import { KmeansEnvironmentVars } from '../vars/kmeans-environment-vars';

@Component({
  selector: 'app-knn',
  providers: [MessageService, ConfirmationService],
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.scss'],
})
export class KnnComponent implements OnInit, OnDestroy {
  selectedWeight = 'uniform';
  selectedMetric = 'euclidean';
  kValue = 3;

  weights = [
    {
      label: 'Uniform',
      value: 'uniform',
    },
    {
      label: 'Distance',
      value: 'distance',
    },
  ];

  metrics = [
    {
      label: 'L1 | Manhattan',
      value: 'manhattan',
    },
    {
      label: 'L2 | Euclidean',
      value: 'euclidean',
    },
    {
      label: 'L∞ | Chebyshev',
      value: 'chebyshev',
    },
    {
      label: 'Lₚ | Minkowski',
      value: 'minkowski',
    },
  ];

  public graph = {
    data: [
      {
        x: [],
        y: [],
        mode: 'markers',
        marker: {
          size: 10,
          colorscale: [
            ['0.0', '#ff11ff'],
            ['0.111111111111', '#d76cff'],
            ['0.222222222222', '#b294ff'],
            ['0.333333333333', '#9aafff'],
            ['0.444444444444', '#99c3ff'],
            ['0.555555555556', '#add2ff'],
            ['0.666666666667', '#9cd1ff'],
            ['0.777777777778', '#87cfff'],
            ['0.888888888889', '#6eceff'],
            ['1.0', '#4ecdff'],
          ],
          color: [],
          line: {
            width: 1,
            color: 'black',
          },
        },
      },
      {
        x: [],
        y: [],
        z: [],
        colorscale: [
          ['0.0', '#ff11ff'],
          ['0.111111111111', '#d76cff'],
          ['0.222222222222', '#b294ff'],
          ['0.333333333333', '#9aafff'],
          ['0.444444444444', '#99c3ff'],
          ['0.555555555556', '#add2ff'],
          ['0.666666666667', '#9cd1ff'],
          ['0.777777777778', '#87cfff'],
          ['0.888888888889', '#6eceff'],
          ['1.0', '#4ecdff'],
        ],
        type: 'contour',
      },
    ] as any,
    layout: {
      template: KmeansEnvironmentVars.template,
      font: {
        family: KmeansEnvironmentVars.fontFamily,
        size: KmeansEnvironmentVars.fontSize,
      },
    },
  };

  constructor(
    private messageService: MessageService,
    private algorithmsService: AlgorithmsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('knn')) {
      this.updateGraphData(JSON.parse(localStorage.getItem('knn') as string));
    } else {
      this.initPage();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('knn');
  }

  initPage(): void {
    AppComponent.hidePlotly();
    this.algorithmsService
      .getExampleKnn()
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Example data could not be loaded',
          });
          return err;
        })
      )
      .subscribe((data) => {
        this.updateGraphData(data);
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
      if (!this.validateInput(text, this.kValue)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid input',
        });
        return;
      }
      const payload = {
        points: text,
        k: this.kValue,
        weight: this.selectedWeight,
        metric: this.selectedMetric,
      };
      this.algorithmsService
        .updateKnnData(payload)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Invalid input',
            });
            return err;
          })
        )
        .subscribe((data) => {
          localStorage.setItem('knn', JSON.stringify(data));
          this.updateGraphData(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data updated',
          });
        });
    };
    reader.readAsText(file);
  }

  updateGraphData(data: any) {
    this.graph.data[0].x = data.scatter_x;
    this.graph.data[0].y = data.scatter_y;
    this.graph.data[0].marker.color = data.y;
    this.graph.data[1].x = data.contour_x;
    this.graph.data[1].y = data.contour_y;
    this.graph.data[1].z = data.z;
    localStorage.setItem('knn', JSON.stringify(data));
  }

  validateInput(points: any, k: any): boolean {
    const kInt = parseInt(k, 10);

    const pointsStrings = points.split('\n');
    if (pointsStrings.length < 2) {
      return false;
    }

    if (pointsStrings.length < kInt) {
      return false;
    }

    const firstPointLength = pointsStrings[0].split(',').length;
    if (
      pointsStrings.some(
        (pointString: string) =>
          pointString.split(',').length !== firstPointLength
      )
    ) {
      return false;
    }

    if (
      pointsStrings.some(
        (pointString: string) =>
          pointString.split(',')[firstPointLength - 1] !== '0' &&
          pointString.split(',')[firstPointLength - 1] !== '1'
      )
    ) {
      return false;
    }

    for (const pointString of pointsStrings) {
      const point = pointString.split(',');
      if (
        point.length < 2 ||
        point.includes('') ||
        point.includes(' ') ||
        point.length > 3
      ) {
        return false;
      }
      if (isNaN(Number(point[0])) || isNaN(Number(point[1]))) {
        return false;
      }
    }
    return true;
  }

  updateData($event: SubmitEvent, kNNForm: HTMLFormElement): void {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(kNNForm) as any);

    if (!this.validateInput(data['points'], this.kValue)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Dataset is not valid',
      });
      return;
    }

    this.algorithmsService
      .updateKnnData({
        ...data,
        k: this.kValue,
        metric: this.selectedMetric,
        weight: this.selectedWeight,
      })
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Data could not be updated',
          });
          return err;
        })
      )
      .subscribe((data) => {
        localStorage.setItem('knn', JSON.stringify(data));
        this.updateGraphData(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data updated',
        });
      });
    return;
  }

  onMetricChange($event: any): void {
    this.selectedMetric = $event.value;
  }

  onWeightChange($event: any): void {
    this.selectedWeight = $event.value;
  }

  showHelp(event: Event) {
    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        `Your data should be a newline separated list of points. \n
        Each point should be a comma separated list of numbers. \n 
        The last number in each point should be the class of the point (0 or 1).`,
      acceptLabel: 'Ok',
      rejectVisible: false,
    });
  }
}
