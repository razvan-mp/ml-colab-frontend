import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { AlgorithmsService } from '../services/algorithms.service';
import { KmeansEnvironmentVars } from '../vars/kmeans-environment-vars';

@Component({
  selector: 'app-hclustering',
  providers: [MessageService],
  templateUrl: './hclustering.component.html',
  styleUrls: ['./hclustering.component.scss'],
})
export class HclusteringComponent implements OnInit {
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
    private algorithmsService: AlgorithmsService
  ) {}

  ngOnInit() {
    this.initPage();
  }

  updateGraphData(data: any) {
    this.graph.data = data['data'];
    this.graph.layout.xaxis.ticktext = data['tickvals'];
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
          severity: 'info',
          summary: 'Success',
          detail: 'Data loaded successfully',
        });
      });
    AppComponent.hidePlotly();
  }

  updateData($event: SubmitEvent, HClusteringForm: HTMLFormElement) {
    $event.preventDefault();

    const data = Object.fromEntries(
      new FormData(HClusteringForm as any) as any
    );

    this.algorithmsService
      .updateHclusteringData(data)
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
}
