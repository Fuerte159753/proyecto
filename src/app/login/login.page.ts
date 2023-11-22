import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Asegúrate de importar AlertController

interface LoginResponse {
  message: string;
  Tipeuser: number;
  id: number; // O el tipo de dato que corresponda al ID del cliente
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})

export class LoginPage implements OnInit {
  miFormulario: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private alertController: AlertController) {
    this.miFormulario = this.fb.group({
      Correo: ['', Validators.required],
      password: ['', Validators.required] 
    });
  }

  async showAlert(message: string) { // Marca la función como async
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = {
      Correo: this.miFormulario.value.Correo,
      password: this.miFormulario.value.password
    };

    this.http.post<LoginResponse>('http://localhost/ConManda.php', JSON.stringify(data), { headers: headers })
  .subscribe(response => {
    console.log(response); // Maneja la respuesta del servidor

    if (response.Tipeuser == 0) {
      // Redirige al repartidor
      this.router.navigate(['/repartidor']);
      console.log('eres un repartidor');
    } else if (response.Tipeuser == 1) {
      // Redirige al cliente y envía el ID del cliente
      this.router.navigate(['/cliente'], { queryParams: { idCliente: response.id } });
    } else if (response.message === "Verifica tus datos" || response.message === "Usuario no encontrado") {
      // Muestra una alerta de Ionic
      this.showAlert(response.message);
    }
  });
  }

  ngOnInit() {
  }
}
