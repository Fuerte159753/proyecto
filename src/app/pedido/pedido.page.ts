import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { categorias } from './categorias';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  mensaje: string = '';
  clienteId: string = ''; // Variable para almacenar el ID del cliente
  nombreCliente: string = '';
  direcciones: string[] = [];
  categorias = categorias;
  subcategorias: string[] = [];
  mostrarPedido: boolean = false;
  pedidoAgregado: boolean = false;
  pedidoTexto: string = '';
  camposCompletos: boolean = false;

  categoria: string = '';
  subcategoria: string = '';
  pedidoTexto1: string = '';
  direccion: string = '';


  constructor(private alertController: AlertController, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    
   }
   ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente']; // Obtén el ID del cliente de los parámetros de la URL
      this.obtenerNombreCliente();
      this.obtenerDirecciones();
    });
    const hora = new Date().getHours();
    
    if (hora >= 0 && hora < 12) {
      this.mensaje = 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
      this.mensaje = 'Buenas tardes';
    } else {
      this.mensaje = 'Buenas noches';
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
obtenerDirecciones() {
  this.http.get<any[]>('http://localhost/pedido.php?idCliente=' + this.clienteId)
    .subscribe(response => {
      if (response && response.length > 0) {
        this.direcciones = response;
      }
    }, error => {
      console.error('Error al obtener direcciones:', error);
    });
}

seleccionCategoria(event: any) {
  const nombreCategoriaSeleccionada = event.detail.value;
  const categoriaSeleccionada = this.categorias.find(categoria => categoria.nombre === nombreCategoriaSeleccionada);

  if (categoriaSeleccionada) {
    this.subcategorias = categoriaSeleccionada.subcategorias || [];
    this.mostrarPedido = this.subcategorias.length > 0;
    this.validarCamposCompletos();
  } else {
    this.mostrarPedido = false;
    this.camposCompletos = false;
  }
}

actualizarPedidoTexto(event: any) {
  this.pedidoTexto = event.target.value;
  this.validarCamposCompletos(); // Verificar si todos los campos están completos
}

validarCamposCompletos() {
  // Verificar si todos los campos requeridos están completos
  this.camposCompletos = this.mostrarPedido && this.pedidoTexto.trim() !== '';
}

convertirPrimeraLetraMayuscula(texto: string): string {
  return texto.replace(/\b\w/g, (char) => char.toUpperCase());
}

enviarPedido() {
  const data = {
    categoria: this.categoria,
    subcategoria: this.subcategoria,
    pedidoTexto1: this.pedidoTexto1,
    direccion: this.direccion,
    clienteId: this.clienteId,
  };

  this.http.post<any>('http://localhost/registropedido.php', data)
    .subscribe(response => {
      console.log(response);

      // Mostrar una alerta si la respuesta es positiva
      if (response && response.mensaje == 'registrado') {
        this.mostrarAlerta();
      }
    }, error => {
      console.error('Error al enviar el pedido:', error);
    });
}

async mostrarAlerta() {
  const alert = await this.alertController.create({
    header: 'Pedido realizado',
    message: 'Tu pedido será procesado. Tendrás 5 minutos para cancelarlo.',
    buttons: [
      {
        text: 'OK',
        handler: () => {
          // Redireccionar a /cliente con el clienteId adjuntado
          const clienteId = this.clienteId; // Asegúrate de tener el clienteId disponible aquí
          this.router.navigate(['/cliente'], { queryParams: { clienteId } });
        }
      }
    ]
  });

  await alert.present();
}

}
