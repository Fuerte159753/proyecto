import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pedi-anter',
  templateUrl: './pedi-anter.page.html',
  styleUrls: ['./pedi-anter.page.scss'],
})
export class PediAnterPage implements OnInit {
  //variables
  clienteId: string = '';
  pedidos: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente'];
    });
    this.http.get<any[]>('http://localhost/busqueda.php?cliente_id=' + this.clienteId)
    .subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // Agrega este console.log
        if (Array.isArray(data) && data.length > 0) {
          this.pedidos = data;
        } else {
          this.pedidos = [];
        }
        console.log('Pedidos:', this.pedidos); // Agrega este console.log
      },
      (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    );
  }
  irperfil() {
    this.router.navigate(['/perfil'], { queryParams: { idCliente: this.clienteId } });
  }
}