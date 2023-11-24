import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pedi-anter',
  templateUrl: './pedi-anter.page.html',
  styleUrls: ['./pedi-anter.page.scss'],
})
export class PediAnterPage implements OnInit {
  //variables
  clienteId: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['idCliente'];
    });
  }

}
