import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import axios from "axios";
import {KmeansEnvironmentVars} from "../vars/kmeans-environment-vars";

@Component({
  selector: 'app-kmeans',
  providers: [MessageService],
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.scss']
})
export class KmeansComponent implements OnInit {
  public graph = {
    data: [] as any,
    layout: {
      template: KmeansEnvironmentVars.template,
      font: {
        family: KmeansEnvironmentVars.fontFamily,
        size: KmeansEnvironmentVars.fontSize,
      },
    }
  };

  public customCentroids: boolean = true;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.initPage();
  }

  initPage() {
    axios.get("http://localhost:8000/api/get_example_k_means")
      .then(response => {
        const data = JSON.parse(response.data);
        this.updateGraphData(data);
      });
    this.hidePlotly();
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
        marker: {color: color, size: 20, line: {color: 'black', width: 2}},
        name: 'Centroid ' + (centroidIndex + 1)
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
          marker: {color: `${color}`, size: 10, line: {color: 'black', width: 2}},
          name: 'Point ' + (pointIndex + 1)
        });
      }
    }
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

  updateData($event: SubmitEvent, kmeansInput: HTMLFormElement) {
    $event.preventDefault();
    const data = Object.fromEntries(new FormData(kmeansInput) as any) as any;
    const centroids = data.centroids;
    const points = data.points;

    axios.post('http://localhost:8000/api/get_k_means_response/', data).then((res) => {
      const data = JSON.parse(res.data);
      this.updateGraphData(data);
    }).catch((err) => {
      console.log(err);
    })
  }

  updateUseCentroidOption() {
    this.customCentroids = !this.customCentroids;
    if (!this.customCentroids) {
      document.getElementById('centroid-input')!.innerText = '';
    }
  }

  addRandomPoints() {
    for (let pointIndex = 0; pointIndex < 15; pointIndex++) {
      this.graph.data.push(
        {
          x: [Math.floor(Math.random() * 200) - 100],
          y: [Math.floor(Math.random() * 200) - 100],
          r: 10,
          type: 'scatter',
          mode: 'markers',
          marker: {color: 'white', size: 10},
          name: 'Point'
        }
      )
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
        marker: {color: 'white', size: 20, line: {color: 'black', width: 2}},
        name: 'Centroid'
      });
    }
  }

  removeAllCentroids() {
    this.graph.data = this.graph.data.filter((data: any) => {
      return !data.name.includes('Centroid');
    });
  }

  runKmeans() {
    const points = this.graph.data.filter((data: any) => {
      return data.name.includes('Point');
    }).map((data: any) => {
      return data.x[0] + ',' + data.y[0];
    }).join('\n');

    const centroids = this.graph.data.filter((data: any) => {
      return data.name.includes('Centroid');
    }).map((data: any) => {
      return data.x[0] + ',' + data.y[0];
    }).join('\n');

    const data = {
      centroids: centroids,
      points: points
    };

    axios.post('http://localhost:8000/api/get_k_means_response/', data).then((res) => {
      const data = JSON.parse(res.data);
      this.updateGraphData(data);
    }).catch((err) => {
      console.log(err);
    })
  }
}
