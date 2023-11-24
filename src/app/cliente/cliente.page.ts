import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  mensaje: string = '';
  clienteId: string = ''; // Variable para almacenar el ID del cliente
  nombreCliente: string = ''; // Variable para almacenar el nombre del cliente

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente']; // Obtén el ID del cliente de los parámetros de la URL
      this.obtenerNombreCliente(); // Llama a la función para obtener el nombre del cliente
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

  obtenerNombreCliente() {
    this.http.get<any>('http://localhost/clientepage.php?idCliente=' + this.clienteId)
    .subscribe(response => {
      if (response.nombreCliente) {
        this.nombreCliente = this.convertirPrimeraLetraMayuscula(response.nombreCliente);
      } else {
        this.nombreCliente = 'Nombre no encontrado';
      }
    }, error => {
      console.error('Error al obtener el nombre del cliente:', error);
    });
}

convertirPrimeraLetraMayuscula(texto: string): string {
  return texto.replace(/\b\w/g, (char) => char.toUpperCase());
}
irAPedido() {
  this.router.navigate(['/pedido'], { queryParams: { idCliente: this.clienteId } });
}
irperfil() {
  this.router.navigate(['/perfil'], { queryParams: { idCliente: this.clienteId } });
}
irestatus(){
  this.router.navigate(['/pedi-anter'], {queryParams: { idCliente: this.clienteId } })
}

}
