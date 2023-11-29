import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { categorias } from './categorias';
import { AlertController } from '@ionic/angular';

interface ClienteResponse {
  nombreCliente: string;
}

interface PedidoResponse {
  mensaje: string;
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  mensaje: string = '';
  clienteId: string = '';
  nombreCliente: string = '';
  direcciones: string[] = [];
  categorias = categorias;
  subcategorias: string[] = [];
  mostrarPedido: boolean = false;
  pedidoTexto: string = '';
  camposCompletos: boolean = false;

  categoria: string = '';
  subcategoria: string = '';
  pedidoTexto1: string = '';
  direccion: string = '';

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente'];
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
    this.http.get<ClienteResponse>('http://localhost/clientepage.php?idCliente=' + this.clienteId)
      .subscribe(response => {
        this.nombreCliente = response.nombreCliente ? this.convertirPrimeraLetraMayuscula(response.nombreCliente) : 'Nombre no encontrado';
      }, error => {
        console.error('Error al obtener el nombre del cliente:', error);
      });
  }

  obtenerDirecciones() {
    this.http.get<string[]>('http://localhost/pedido.php?idCliente=' + this.clienteId)
      .subscribe(response => {
        this.direcciones = response || [];
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
    this.validarCamposCompletos();
  }

  validarCamposCompletos() {
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

    this.http.post<PedidoResponse>('http://localhost/registropedido.php', data)
      .subscribe(response => {
        console.log(response);

        if (response && response.mensaje === 'registrado') {
          this.mostrarAlerta();
        }
      }, error => {
        console.error('Error al enviar el pedido:', error);
      });
  }

  async mostrarAlerta() {
    try {
      const alert = await this.alertController.create({
        header: 'Pedido realizado',
        message: 'Tu pedido será procesado. Tendrás 5 minutos para cancelarlo.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/cliente'], { queryParams: { clienteId: this.clienteId } });
            }
          }
        ]
      });

      await alert.present();
    } catch (error) {
      console.error('Error al mostrar la alerta:', error);
    }
  }
}
