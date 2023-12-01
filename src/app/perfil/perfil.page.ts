import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  //variables
  clienteId: string = '';
  clienteData: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente'];
      this.obtenerDatosCliente();
    });
  }
  navigateBackToClientePage() {
    this.router.navigate(['/cliente'], {
      queryParams: {
        idCliente: this.clienteId // Aquí proporciona el valor de clienteId
      }
    });
  }

  obtenerDatosCliente() {
    this.http.get(`http://localhost/perfil.php?idCliente=${this.clienteId}`)
      .subscribe((data: any) => {
        this.clienteData = data;
      }, (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      });
  }
}