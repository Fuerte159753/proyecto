import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  message: string;
  Tipeuser: number;
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})

export class LoginPage implements OnInit {
  miFormulario: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.miFormulario = this.fb.group({
      Correo: ['', Validators.required],
      password: ['', Validators.required] 
    });
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
        this.router.navigate(['/cliente']);
        console.log('eres un repartidor');
      } else if (response.Tipeuser == 1) {
        // Redirige al usuario
        this.router.navigate(['/cliente']);
      }
    });
}
  
  ngOnInit() {
  }
}
