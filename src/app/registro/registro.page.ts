import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Asegúrate de importar AlertController

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

  constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    const data = { nombre:this.nombre, apellido: this.apellido, direccion: this.direccion, telefono: this.telefono, correo: this.correo, password: this.password };
    this.http.post('http://localhost/registromanda.php', data)
      .subscribe((response) => {
        console.log('Usuario registrado:', response);
        this.router.navigate(['/login']); // Redirecciona a la página de inicio
      }, (error) => {
        console.error('Error al registrar usuario:', error);
      });
  }
  ngOnInit() {
  }

}
