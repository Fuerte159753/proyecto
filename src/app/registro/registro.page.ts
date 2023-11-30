import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { rutas } from './rutas';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  // direccion: string = ''; // No estoy seguro si esto debería ser utilizado, así que comenté esta línea
  telefono: string = '';
  correo: string = '';
  password: string = '';
  rutaSeleccionada: string = '';
  rutas: string[] = rutas;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  async submitForm() {
    // Verifica si algún campo está vacío
    if (
      !this.nombre.trim() ||
      !this.apellido.trim() ||
      !this.rutaSeleccionada.trim() ||
      !this.telefono.trim() ||
      !this.correo.trim() ||
      !this.password.trim()
    ) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return; // Detiene el envío del formulario si hay campos vacíos
    }

    const data = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      // direccion: this.direccion.trim(), // No estoy seguro si esto debería ser utilizado, así que comenté esta línea
      telefono: this.telefono.trim(),
      correo: this.correo.trim(),
      password: this.password.trim(),
      rutaSeleccionada: this.rutaSeleccionada.trim(),
    };

    this.http.post('http://localhost/registromanda.php', data).subscribe(
      (response) => {
        console.log('Usuario registrado:', response);
        this.router.navigate(['/login']); // Redirecciona a la página de inicio
      },
      (error) => {
        console.error('Error al registrar usuario:', error);
      }
    );
  }

  ngOnInit() {}
}
