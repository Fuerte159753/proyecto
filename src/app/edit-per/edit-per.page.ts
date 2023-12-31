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
  direcciones: any[] = [];

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
        this.route.queryParams.subscribe(params => {
          this.clienteId = params['idC'];
          this.obtenerDireccionesCliente();
        });
      });
    }

    eliminarDireccion(idDireccion: number) {
      this.mostrarConfirmacion1('Confirmación', '¿Está seguro de que desea modificar su perfil?')
        .then((confirmacion) => {
          if (confirmacion) {

            const formDatos = new FormData();
            formDatos.append('id_dire', idDireccion.toString());
      
            this.http.post('https://mandaditos.proyectoinutvm.com/elimi_dire.php', formDatos)
              .subscribe((response: any) => {
                //window.location.reload(); 
                if(response.success){
           
                  this.direcciones = []
                  this.obtenerDireccionesCliente();
                  this.mostrarAlerta('Éxito', 'Dirección eliminada correctamente.');
            
             
                }else{
                  this.mostrarAlerta('Error', 'Ocurrió un error al eliminar la dirección.');
                }
              }, (error) => {
                console.error('Error al eliminar dirección:', error);
              });
          }
        });
    }

    async mostrarConfirmacion1(titulo: string, mensaje: string): Promise<boolean> {
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
       
    obtenerDireccionesCliente() {
      this.http.get<any[]>(`https://mandaditos.proyectoinutvm.com/bus_dire.php?cliente_id=${this.clienteId}`)
        .subscribe((data: any[]) => {
          this.direcciones = data;
        }, (error) => {
          console.error('Error al obtener las direcciones:', error);
        });
    }

  agregarNuevaDireccion() {
      const formDatos = new FormData();
      formDatos.append('cliente_id', this.clienteId);
      formDatos.append('direccion', this.nuevaDireccion);

      this.http.post('https://mandaditos.proyectoinutvm.com/insert_dire.php', formDatos)
          .subscribe((response: any) => {

              if(response.success) {
                this.mostrarAlerta('Éxito', 'Dirección agregada correctamente');
                this.obtenerDireccionesCliente();
                this.nuevaDireccion = '';
              }else{
                this.mostrarAlerta('Error', 'Ocurrió un error al agregar dirección.');
              }

          }, (error) => {
              console.error('Error al agregar dirección:', error);
          });
  }  

  navigateBackToClientePage() {
    this.router.navigate(['/cliente'], { queryParams: { idCliente: this.clienteId } });
  }
  obtenerDatosCliente() {
    this.http.get(`https://mandaditos.proyectoinutvm.com/perfil.php?idCliente=${this.clienteId}`)
      .subscribe((data: any) => {
        this.clienteData = data;
        this.originalData = { ...data };
      }, (error) => {
        console.error('Error al obtener los datos del cliente:', error);
      });
  }
  obtenerDireccion(){
    this.http.get(`https://mandaditos.proyectoinutvm.com/per_dire.php?idCliente=${this.clienteId}`)
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

    const formDatos = new FormData();
    formDatos.append('id', this.clienteId);
    formDatos.append('nombre', this.clienteData.nombre);
    formDatos.append('apellido', this.clienteData.apellido);
    formDatos.append('telefono', this.clienteData.telefono);
    formDatos.append('password', this.clienteData.password);

    this.http.post('https://mandaditos.proyectoinutvm.com/actualizar_perfil.php', formDatos)
    .subscribe((response: any) => {
        console.log(response); // Mostrar la respuesta en la consola
        if (response.success) {
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
