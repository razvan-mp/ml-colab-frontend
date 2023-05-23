import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { AlgorithmsService } from '../services/algorithms.service';
import { KmeansEnvironmentVars } from '../vars/kmeans-environment-vars';

@Component({
  selector: 'app-hclustering',
  providers: [MessageService, ConfirmationService],
  templateUrl: './hclustering.component.html',
  styleUrls: ['./hclustering.component.scss'],
})
export class HclusteringComponent implements OnInit, OnDestroy {
  selectedMetric = 'euclidean';
  selectedMethod = 'single';

  methods = [
    {
      label: 'SL | Single Linkage',
      value: 'single',
    },
    {
      label: 'CL | Complete Linkage',
      value: 'complete',
    },
    {
      label: 'AL | Average Linkage',
      value: 'average',
    },
    {
      label: 'WA | Ward',
      value: 'ward',
    },
    {
      label: 'MC | Median Centroid',
      value: 'median',
    },
    {
      label: 'CE | Centroid',
      value: 'centroid',
    },
    {
      label: 'ME | Median',
      value: 'median',
    },
  ];

  metrics = [
    {
      label: 'L1 | Manhattan',
      value: 'cityblock',
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
    {
      label: 'Lₚ | Mahalanobis',
      value: 'mahalanobis',
    },
    {
      label: 'Lₚ | Hamming',
      value: 'hamming',
    },
    {
      label: 'Lₚ | Canberra',
      value: 'canberra',
    },
    {
      label: 'Lₚ | Braycurtis',
      value: 'braycurtis',
    },
    {
      label: 'Lₚ | Jaccard',
      value: 'jaccard',
    },
  ];

  public graph = {
    data: [] as any,
    layout: {
      xaxis: {
        ticks: '',
        ticktext: [] as any,
        tickvals: [
          5.0, 15.0, 25.0, 35.0, 45.0, 55.0, 65.0, 75.0, 85.0, 95.0, 105.0,
          115.0,
        ],
      },
      yaxis: {
        fixedrange: true,
      },
      showlegend: false,
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

  ngOnInit() {
    if (localStorage.getItem('hclustering')) {
      this.updateGraphData(
        JSON.parse(localStorage.getItem('hclustering') as string)
      );
    } else {
      this.initPage();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('hclustering');
  }

  updateGraphData(data: any) {
    this.graph.data = data['data'];
    this.graph.layout.xaxis.ticktext = data['tickvals'];
    localStorage.setItem('hclustering', JSON.stringify(data));
  }

  initPage() {
    this.algorithmsService
      .getExampleHclustering()
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
        this.updateGraphData(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Example data loaded successfully',
        });
      });
    AppComponent.hidePlotly();
  }

  validateMetricMethod(): boolean {
    if (this.selectedMethod === 'ward' && this.selectedMetric !== 'euclidean') {
      return false;
    }
    if (
      this.selectedMethod === 'centroid' &&
      this.selectedMetric !== 'euclidean'
    ) {
      return false;
    }
    if (
      this.selectedMethod === 'median' &&
      this.selectedMetric !== 'euclidean'
    ) {
      return false;
    }
    return true;
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
      const payload = {
        points: text,
        method: this.selectedMethod,
        metric: this.selectedMetric,
      };

      if (!this.validateMetricMethod()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Method ${
            this.selectedMethod
          } is not compatible with metric ${
            this.metrics.find((metric) => metric.value === this.selectedMetric)
              ?.label
          }. Use L2 | Euclidean instead.`,
        });
        return;
      }

      this.algorithmsService
        .updateHclusteringData(payload)
        .pipe(
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating data',
            });
            return error;
          })
        )
        .subscribe((data) => {
          this.updateGraphData(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data updated successfully',
          });
        });
    };
    reader.readAsText(file);
  }

  updateData($event: SubmitEvent, HClusteringForm: HTMLFormElement) {
    $event.preventDefault();

    const data = Object.fromEntries(
      new FormData(HClusteringForm as any) as any
    );

    this.algorithmsService
      .updateHclusteringData({
        ...data,
        method: this.selectedMethod,
        metric: this.selectedMetric,
      })
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating data',
          });
          return error;
        })
      )
      .subscribe((data) => {
        this.updateGraphData(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data updated successfully',
        });
      });
  }

  showHelp(event: Event) {
    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Your data must be a newline separated list of points.\n
        Each point must be a comma separated list of coordinates.\n
        Please note that the number of coordinates must be the same for all points.\n
        The first line will correspond to the letter A, the second to B, and so on.`,
      acceptLabel: 'Ok',
      rejectVisible: false,
    });
  }
}
