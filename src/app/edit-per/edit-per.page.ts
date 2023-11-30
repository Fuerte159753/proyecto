import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-per',
  templateUrl: './edit-per.page.html',
  styleUrls: ['./edit-per.page.scss'],
})
export class EditPerPage implements OnInit {
  clienteId: string = '';
  clienteData: any = {};
  direData: any = {};
  nombre: string = '';
  apellido: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  password: string = '';
  originalData: any = {};
  nuevaDireccion: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) { }
  ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.clienteId = params['idC'];
        this.obtenerDatosCliente();
        this.obtenerDireccion();
      });
    }
  agregarNuevaDireccion() {
      const datosDireccion = {
          cliente_id: this.clienteId,
          direccion: this.nuevaDireccion
      };
      console.log('Datos a enviar al servidor:', datosDireccion);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post('http://localhost/insert_dire.php', datosDireccion, { headers })
          .subscribe((response: any) => {
              console.log(response);
          }, (error) => {
              console.error('Error al agregar dirección:', error);
          });
  }    
  navigateBackToClientePage() {
    this.router.navigate(['/cliente'], { queryParams: { idCliente: this.clienteId } });
  }
  obtenerDatosCliente() {
    this.http.get(`http://localhost/perfil.php?idCliente=${this.clienteId}`)
      .subscribe((data: any) => {
        this.clienteData = data;
        this.originalData = { ...data };
      }, (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      });
  }
  obtenerDireccion(){
    this.http.get(`http://localhost/per_dire.php?idCliente=${this.clienteId}`)
      .subscribe((data: any) => {
        this.direData = data;
      }, (error) => {
        console.error('Error al obtener las direcciones:', error);
      });
  }

  async actualizarPerfil() {
    if (this.sonDatosIguales(this.clienteData, this.originalData)) {
        await this.mostrarAlerta('Advertencia', 'Los datos son iguales a los anteriores. No se realizaron cambios.');
        return;
    }

    const confirmacion = await this.mostrarConfirmacion('Confirmación', '¿Está seguro de que desea modificar su perfil?');
    if (!confirmacion) {
        return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const datosCliente = {
        id: this.clienteId,
        nombre: this.clienteData.nombre,
        apellido: this.clienteData.apellido,
        telefono: this.clienteData.telefono,
        password: this.clienteData.password
    };
    this.http.post('http://localhost/actualizar_perfil.php', datosCliente, { headers, responseType: 'text' })
    .subscribe((response: any) => {
        console.log(response); // Mostrar la respuesta en la consola
        if (response && response.includes('Datos actualizados correctamente')) {
            this.mostrarAlerta('Éxito', 'Perfil actualizado correctamente.');
        } else {
            this.mostrarAlerta('Error', 'Ocurrió un error al actualizar el perfil.');
        }
    }, (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al actualizar el perfil.');
    });

  }

  sonDatosIguales(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarConfirmacion(titulo: string, mensaje: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [
          {
            text: 'No',
            handler: () => resolve(false)
          },
          {
            text: 'Sí',
            handler: () => resolve(true)
          }
        ]
      });
      await confirm.present();
    });
  }
}
