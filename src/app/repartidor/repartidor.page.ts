import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
})
export class RepartidorPage implements OnInit {

  mensaje: string = '';
  repaId: string = '';
  pedidosPendientes: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
  
  marcarPedidoEntregado(pedidoId: number) {
    const url = 'http://localhost/cambio_entre.php';
    console.log(pedidoId);
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    body.set('pedido_id', pedidoId.toString());
  
    this.http.post(url, body.toString(), { headers }).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        console.error('Error al enviar el pedido:', error);
      }
    );
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.repaId = params['idRe'];
      this.cargarPedidosPendientes();
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

  cargarPedidosPendientes() {
    this.http.get<any[]>(`http://localhost/buscar_pedido_repartidor.php?repartidorId=${this.repaId}`)
      .subscribe(
        (data) => {
          this.pedidosPendientes = data;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
