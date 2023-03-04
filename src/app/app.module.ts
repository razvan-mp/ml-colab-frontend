import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTypedJsModule } from 'ngx-typed-js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { Id3Component } from './id3/id3.component';
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from "primeng/toast";
import { KmeansComponent } from './kmeans/kmeans.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PageforbiddenComponent } from './pageforbidden/pageforbidden.component';
import {PlotlyModule} from "angular-plotly.js";
import * as PlotlyJS from 'plotly.js-dist-min';
import {CommonModule} from "@angular/common";
import { HclusteringComponent } from './hclustering/hclustering.component';
import { KnnComponent } from './knn/knn.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    Id3Component,
    KmeansComponent,
    PagenotfoundComponent,
    PageforbiddenComponent,
    HclusteringComponent,
    KnnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxTypedJsModule,
    NgxGraphModule,
    ToastModule,
    PlotlyModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
