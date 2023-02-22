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
    layout: {template: KmeansEnvironmentVars.template}
  };

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
        marker: {color: color, size: 20},
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
          r: 10,
          type: 'scatter',
          mode: 'markers',
          marker: {color: color, size: 10},
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
}
