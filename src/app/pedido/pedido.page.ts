import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { categorias } from './categorias';
import { AlertController } from '@ionic/angular';

interface ClienteResponse {nombreCliente: string;}
interface PedidoResponse {mensaje: string;}

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
    private alertController: AlertController, private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente'];
      this.obtenerNombreCliente();
      this.obtenerDirecciones();
    });
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) {
      this.mensaje = 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
      this.mensaje = 'Buenas tardes';
    } else {
      this.mensaje = 'Buenas noches';
    }
  }
  obtenerNombreCliente() {
    this.http.get<ClienteResponse>('https://mandaditos.proyectoinutvm.com/clientepage.php?idCliente=' + this.clienteId)
      .subscribe(response => {
        this.nombreCliente = response.nombreCliente ? this.convertirPrimeraLetraMayuscula(response.nombreCliente) : 'Nombre no encontrado';
      }, error => {
        console.error('Error al obtener el nombre del cliente:', error);
      });
  }
  obtenerDirecciones() {
    this.http.get<string[]>('https://mandaditos.proyectoinutvm.com/pedido.php?idCliente=' + this.clienteId)
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
      if (categoriaSeleccionada.nombre === 'Otros') {
        // Si la categoría seleccionada es "Otros", no se muestra la subcategoría
        this.mostrarPedido = true; // Mostrar otros campos de pedido
        this.subcategorias = []; // Vaciar las subcategorías para evitar que se muestren
      } else {
        // Para otras categorías
        this.subcategorias = categoriaSeleccionada.subcategorias || [];
        this.mostrarPedido = this.subcategorias.length > 0;
      }
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
  if (this.mostrarPedido) {
    if (this.categoria === 'Otros') {
      // Si la categoría es "Otros", no requerimos la subcategoría
      this.camposCompletos = this.pedidoTexto.trim() !== '' && this.direccion !== '';
    } else {
      // Para otras categorías, todos los campos deben estar completos
      this.camposCompletos = this.pedidoTexto.trim() !== '' && this.direccion !== '' && this.subcategoria !== '';
    }
  } else {
    this.camposCompletos = false;
  }
}
  async mostrarAlertaCamposIncompletos() {
    const alert = await this.alertController.create({
      header: 'Campos incompletos',
      message: 'Por favor, completa todos los campos obligatorios.',
      buttons: ['OK']
    });
    await alert.present();
  }
  convertirPrimeraLetraMayuscula(texto: string): string {
    return texto.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  enviarPedido() {
  this.validarCamposCompletos(); // Validar campos antes de enviar

  if (this.camposCompletos) {
    const fechaHoraActual = new Date();
    // Obtener año, mes y día
    const year = fechaHoraActual.getFullYear();
    const month = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaHoraActual.getDate().toString().padStart(2, '0');
    // Obtener hora y minutos
    let hours = fechaHoraActual.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Hora '0' debe mostrarse como '12'
    const minutes = fechaHoraActual.getMinutes().toString().padStart(2, '0');
    const fechaHoraFormateada = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    const data = {
      categoria: this.categoria,
      subcategoria: this.subcategoria,
      pedidoTexto1: this.pedidoTexto1,
      direccion: this.direccion,
      clienteId: this.clienteId,
      fechaHora: fechaHoraFormateada
    };
    console.log('Datos a enviar:', data); // Imprimir los datos en la consola
    this.http.post<PedidoResponse>('https://mandaditos.proyectoinutvm.com/registropedido.php', data)
      .subscribe(response => {
        console.log('Respuesta del servidor:', response);
  
        if (response && response.mensaje === 'registrado') {
          this.mostrarAlerta();
        }
      }, error => {
        console.error('Error al enviar el pedido:', error);
      });
      } else {
    // Mostrar alerta solo si los campos están incompletos
    this.mostrarAlertaCamposIncompletos();
  }
  }
  navigateBackToClientePage() {
    this.router.navigate(['/cliente'], {
      queryParams: {
        idCliente: this.clienteId // Aquí proporciona el valor de clienteId
      }
    });
  }
  async mostrarAlerta() {
    try {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se agregó el pedido exitosamente',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/cliente'], { queryParams: { idCliente: this.clienteId } });
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
