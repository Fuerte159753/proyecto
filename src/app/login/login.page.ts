import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

interface LoginResponse {
  message: string;
  Tipeuser: number;
  id: number;
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  miFormulario: FormGroup;
  isButtonDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.miFormulario = this.fb.group({
      Correo: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'circles',
    });

    await loading.present();

    // Espera a que el loading se haya mostrado antes de continuar
    await loading.onDidDismiss();
  }

  checkInternetConnection(): boolean {
    return navigator.onLine;
  }

  async onSubmit() {
    this.isButtonDisabled = true; // Deshabilita el botón mientras se verifica la conexión

    if (!this.checkInternetConnection()) {
      this.isButtonDisabled = false; // Habilita el botón nuevamente
      this.showAlert('No hay conexión a internet. Verifica tu conexión y vuelve a intentarlo.');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = {
      Correo: this.miFormulario.value.Correo,
      password: this.miFormulario.value.password,
    };

    await this.showLoading(); // Muestra el loading solo si los datos del usuario son correctos

    this.http
      .post<LoginResponse>('http://localhost/ConManda.php', JSON.stringify(data), {
        headers: headers,
      })
      .subscribe(
        (response) => {
          console.log(response);

<<<<<<< HEAD
        if (response.Tipeuser == 0) {
          // Redirige al repartidor y envía el ID del repartidor
          this.router.navigate(['/repartidor'], { queryParams: { idRe: response.id } });
        } else if (response.Tipeuser == 1) {
          // Redirige al cliente y envía el ID del cliente
          this.router.navigate(['/cliente'], { queryParams: { idCliente: response.id } });
        } else if (
          response.message == 'Verifica tus datos' ||
          response.message == 'Usuario no encontrado'
        ) {
          this.showAlert(response.message);
=======
          if (response.Tipeuser === 0) {
            this.router.navigate(['/repartidor'], { queryParams: { idRe: response.id } });
          } else if (response.Tipeuser === 1) {
            this.router.navigate(['/cliente'], { queryParams: { idCliente: response.id } });
          } else if (response.message === 'Usuario no encontrado') {
            this.showAlert(response.message); // Muestra el mensaje de datos no encontrados solo si el usuario no fue encontrado
          }

          this.isButtonDisabled = false; // Habilita el botón después de procesar la respuesta
        },
        (error) => {
          this.isButtonDisabled = false; // Habilita el botón en caso de error
          console.error('Error al realizar la solicitud:', error);
>>>>>>> 3b064094b7c36887f2221c62cf21f08a2bcd84a4
        }
      );
  }

  ngOnInit() {}
}
