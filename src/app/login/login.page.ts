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
      duration: 2000,
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



    await this.showLoading();


    const url = 'https://mandaditos.proyectoinutvm.com/ConManda.php';

    const formDatos = new FormData();
    formDatos.append('txtUsuario', this.miFormulario.value.Correo);
    formDatos.append('txtContrasena', this.miFormulario.value.password);

    this.http.post(url, formDatos).subscribe(
      (response: any) => {


        console.log(response);

        if (response && response.Tipeuser === 0) {
          this.router.navigate(['/repartidor'], { queryParams: { idRe: response.id } });
        } else if (response && response.Tipeuser === 1) {
          this.router.navigate(['/cliente'], { queryParams: { idCliente: response.id } });
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
