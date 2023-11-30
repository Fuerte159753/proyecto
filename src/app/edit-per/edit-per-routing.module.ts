import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPerPage } from './edit-per.page';

const routes: Routes = [
  {
    path: '',
    component: EditPerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPerPageRoutingModule {}
