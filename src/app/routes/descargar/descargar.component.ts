import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-descargar',
  templateUrl: './descargar.component.html',
  //template:'',
  styleUrls: ['./descargar.component.scss']
})
export class DescargarComponent implements OnInit {

  constructor(
    private EmpleadoService : EmpleadoService,
    private router: Router) { }

  ngOnInit(): void {
    //console.log("si se está ejecuta ndodasdas")
    this.EmpleadoService.descargar()
    //this.router.navigate('')
    ///console.log("la url donde estamos",this.router.url)
    var verifi : any = sessionStorage.getItem('urlOld');
    var decrypted = CryptoJS.TripleDES.decrypt(verifi, "urlOld");  
    //console.log("la url vieja es::::",decrypted.toString(CryptoJS.enc.Utf8))

    this.router.navigateByUrl(decrypted.toString(CryptoJS.enc.Utf8));
    //this.router.parseUrl('/dashboard');

  }

}
