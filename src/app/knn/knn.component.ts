import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { KmeansEnvironmentVars } from '../vars/kmeans-environment-vars';

@Component({
  selector: 'app-knn',
  providers: [MessageService],
  templateUrl: './knn.component.html',
  styleUrls: ['./knn.component.scss'],
})
export class KnnComponent implements OnInit {
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

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    AppComponent.hidePlotly();
    axios
      .get(`${AppComponent.BACKEND_URL}api/get_knn_example`)
      .then((res) => {
        const data = res.data;
        this.updateGraphData(data);
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'Loaded data successfully!',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateGraphData(data: any) {
    this.graph.data[0].x = data.scatter_x;
    this.graph.data[0].y = data.scatter_y;
    this.graph.data[0].marker.color = data.y;
    this.graph.data[1].x = data.contour_x;
    this.graph.data[1].y = data.contour_y;
    this.graph.data[1].z = data.z;
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

    if (!data['k']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a value for k',
      });
      return;
    }

    if (!this.validateInput(data['points'], data['k'])) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Dataset is not valid',
      });
      return;
    }

    axios
      .post(`${AppComponent.BACKEND_URL}/api/get_knn_response/`, data)
      .then((res) => {
        const data = res.data;
        this.updateGraphData(data);
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'Data updated successfully!',
        });
      })
      .catch((err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Serverside error',
        });
      });
    return;
  }
}
