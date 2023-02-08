import {Component, OnInit} from '@angular/core';
import axios from "axios";

@Component({
  selector: 'app-id3',
  templateUrl: './id3.component.html',
  styleUrls: ['./id3.component.css']
})
export class Id3Component implements OnInit {

  data: any = {};
  constructor() {
  }

  ngOnInit(): void {
    axios.get("http://localhost:8000/api/get_example_id3")
      .then((response) => {
        this.data = response.data;
        this.initPage();
        // console.log(this.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  initPage() {

  }
}
