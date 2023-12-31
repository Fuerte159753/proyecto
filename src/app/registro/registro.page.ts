import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Asegúrate de importar AlertController
import { rutas } from './rutas';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string ='';
  apellido: string ='';
  direccion: string ='';
  telefono: string ='';
  correo: string ='';
  password: string ='';
  rutaSeleccionada: string ='';
  rutas: string[] = rutas; // Define rutas como una propiedad del componente


  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController) {}

    async submitForm() {
      // Verifica si algún campo está vacío
      if (!this.nombre || !this.apellido || !this.rutaSeleccionada || !this.direccion || !this.telefono || !this.correo || !this.password) {
        const alert = await this.alertController.create({
          header: 'Campos incompletos',
          message: 'Por favor, completa todos los campos.',
          buttons: ['OK']
        });
        await alert.present();
        return; // Detiene el envío del formulario si hay campos vacíos
      }
      
      /* const data = {
        nombre: this.nombre,
        apellido: this.apellido,
        direccion: this.direccion,
        telefono: this.telefono,
        correo: this.correo,
        password: this.password,
        rutaSeleccionada: this.rutaSeleccionada,
      } */

      const formDatos = new FormData();
      formDatos.append('nombre', this.nombre);
      formDatos.append('apellido', this.apellido);
      formDatos.append('direccion', this.direccion);
      formDatos.append('telefono', this.telefono);
      formDatos.append('correo', this.correo);
      formDatos.append('password', this.password);
      formDatos.append('rutaSeleccionada', this.rutaSeleccionada);


      // Imprimir los datos en la consola antes de enviarlos al servidor
     // console.log('Datos del formulario:', data);
      this.http.post('https://mandaditos.proyectoinutvm.com/registromanda.php', formDatos)
        .subscribe((response) => {
          console.log('Usuario registrado:', response);
          this.router.navigate(['/login']); // Redirecciona a la página de inicio
        }, (error) => {
          console.error('Error al registrar usuario:', error);
        });
    }        
    navigatelogin() {
      this.router.navigate(['/login']); // Usar paréntesis () en lugar de corchetes []
    }
  ngOnInit() {
  }
}