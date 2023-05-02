import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTypedJsModule } from 'ngx-typed-js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { Id3Component } from './id3/id3.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { KmeansComponent } from './kmeans/kmeans.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PageforbiddenComponent } from './pageforbidden/pageforbidden.component';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { CommonModule } from '@angular/common';
import { HclusteringComponent } from './hclustering/hclustering.component';
import { KnnComponent } from './knn/knn.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { HeaderComponent } from './header/header.component';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { NewsComponent } from './news/news.component';
import { UserNotesComponent } from './user-notes/user-notes.component';
import { UserNotesModalsComponent } from './user-notes-modals/user-notes-modals.component';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { UserTeamsComponent } from './user-teams/user-teams.component';
import { UserSocialsComponent } from './user-socials/user-socials.component';
import { MenuModule } from 'primeng/menu';
import { UserFriendsModalsComponent } from './user-friends-modals/user-friends-modals.component';
import { UserTeamsModalsComponent } from './user-teams-modals/user-teams-modals.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserSocialsModalsComponent } from './user-socials-modals/user-socials-modals.component';
import { UserTeamViewComponent } from './user-team-view/user-team-view.component';
import { UserTeamViewModalsComponent } from './user-team-view-modals/user-team-view-modals.component';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    KnnComponent,
    HeaderComponent,
    SidebarComponent,
    AuthDialogComponent,
    NewsComponent,
    UserNotesComponent,
    UserNotesModalsComponent,
    UserTeamsComponent,
    UserSocialsComponent,
    UserFriendsModalsComponent,
    UserTeamsModalsComponent,
    UserSocialsModalsComponent,
    UserTeamViewComponent,
    UserTeamViewModalsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxTypedJsModule,
    NgxGraphModule,
    ToastModule,
    PlotlyModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    SidebarModule,
    DialogModule,
    ToolbarModule,
    PasswordModule,
    TabViewModule,
    FormsModule,
    CarouselModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    TooltipModule,
    MenuModule,
    MultiSelectModule,
    FileUploadModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    ConfirmPopupModule,
    ProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
