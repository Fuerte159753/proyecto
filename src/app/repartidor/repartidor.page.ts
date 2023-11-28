import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
})
export class RepartidorPage implements OnInit {

  mensaje: string = '';
  repaId: string = '';
  nombreCliente: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.repaId = params['idRe'];
    });
    const hora = new Date().getHours();
    if (hora >= 0 && hora < 12) {
      this.mensaje = 'Buenos Días';
    } else if (hora >= 12 && hora < 18) {
      this.mensaje = 'Buenas Tardes';
    } else {
      this.mensaje = 'Buenas Noches';
    }
  }

}
