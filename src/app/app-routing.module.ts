import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {Id3Component} from "./id3/id3.component";
import {KmeansComponent} from "./kmeans/kmeans.component";
import {PagenotfoundComponent} from "./pagenotfound/pagenotfound.component";
import {PageforbiddenComponent} from "./pageforbidden/pageforbidden.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'id3', component: Id3Component},
  {path: 'kmeans', component: KmeansComponent},
  {path: '404', component: PagenotfoundComponent},
  {path: '403', component: PageforbiddenComponent},
  {path: '**', redirectTo: '/404', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
