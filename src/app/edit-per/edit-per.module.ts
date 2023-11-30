import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPerPageRoutingModule } from './edit-per-routing.module';

import { EditPerPage } from './edit-per.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPerPageRoutingModule
  ],
  declarations: [EditPerPage]
})
export class EditPerPageModule {}
