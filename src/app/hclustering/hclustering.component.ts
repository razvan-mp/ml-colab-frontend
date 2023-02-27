import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { MessageService } from 'primeng/api';
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

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.initPage();
  }

  updateGraphData(data: any) {
    this.graph.data = data['data'];
    this.graph.layout.xaxis.ticktext = data['tickvals'];
  }

  initPage() {
    axios.get('http://localhost:8000/api/get_example_hclustering').then((response) => {
      this.updateGraphData(response.data);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data loaded successfully',
      });
    })
    .catch((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting data',
        });
    });
    this.hidePlotly();
  }

  updateData($event: SubmitEvent, HClusteringForm: HTMLFormElement) {
    $event.preventDefault();

    const payload = Object.fromEntries(new FormData(HClusteringForm as any) as any);
    axios.post('http://localhost:8000/api/get_hclustering_response/', payload).then((response) => {
      this.updateGraphData(response.data);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data updated successfully',
      });
    });
  }

  hidePlotly(): void {
    setTimeout(() => {
      const aTagsWithHref = document.querySelectorAll('a[href]');
      aTagsWithHref.forEach((aTag) => {
        if (aTag!.getAttribute('href')!.includes('plotly')) {
          aTag.remove();
        }
      });
    }, 100);
  }
}
