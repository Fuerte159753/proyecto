import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PediAnterPageRoutingModule } from './pedi-anter-routing.module';

import { PediAnterPage } from './pedi-anter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PediAnterPageRoutingModule
  ],
  declarations: [PediAnterPage]
})
export class PediAnterPageModule {}
