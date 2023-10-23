import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PediAnterPage } from './pedi-anter.page';

const routes: Routes = [
  {
    path: '',
    component: PediAnterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PediAnterPageRoutingModule {}
