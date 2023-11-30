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

// ... (importaciones y declaraciones)

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
    this.isButtonDisabled = true;

    if (!this.checkInternetConnection()) {
      this.isButtonDisabled = false;
      this.showAlert('No hay conexión a internet. Verifica tu conexión y vuelve a intentarlo.');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = {
      Correo: this.miFormulario.value.Correo,
      password: this.miFormulario.value.password,
    };

    await this.showLoading();

    this.http
      .post<LoginResponse>('http://localhost/ConManda.php', JSON.stringify(data), {
        headers: headers,
        observe: 'response' // Esto permite obtener la respuesta completa, incluyendo el código de estado HTTP
      })
      .subscribe(
        (response) => {
          console.log(response);
          if (response.body && response.body.Tipeuser === 0) {
            this.router.navigate(['/repartidor'], { queryParams: { idRe: response.body.id } });
          } else if (response.body && response.body.Tipeuser === 1) {
            this.router.navigate(['/cliente'], { queryParams: { idCliente: response.body.id } });
          } else {
            // Mostrar la alerta si la contraseña es incorrecta o el usuario no fue encontrado
            this.showAlert('Datos incorrectos. Verifícalos.');
          }

          this.isButtonDisabled = false;
        },
        (error) => {
          this.isButtonDisabled = false;
          if (error.status === 401) {
            // Código 401 indica contraseña incorrecta
            this.showAlert('Verifica tus datos. Contraseña incorrecta.');
          } else {
            console.error('Error al realizar la solicitud:', error);
          }
        }
      );
  }

  ngOnInit() {}
}
