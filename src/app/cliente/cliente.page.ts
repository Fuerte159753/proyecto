import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  mensaje: string = '';

  constructor() {
    
   }
   ngOnInit() {
    const hora = new Date().getHours();
    
    if (hora >= 0 && hora < 12) {
      this.mensaje = 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
      this.mensaje = 'Buenas tardes';
    } else {
      this.mensaje = 'Buenas noches';
    }
  }

}
