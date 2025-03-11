import { Injectable, OnInit } from '@angular/core';
import {  take } from 'rxjs/operators';
import { Menu, MenuService } from './menu.service';
import { Irol, LoginService } from 'app/servicios/util/login.service';
import { RolMenuService } from 'app/servicios/util/rolMenu.service';
import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StartupService implements OnInit{



  constructor(
    private authService: LoginService,
    private menuService: MenuService,
    private rolService : RolMenuService
  ) {}
  ngOnInit(): void {
    sessionStorage.clear();
  }


  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load(m : any) {

    if(m == undefined){
      var resp = this.validarUsuario();
    //  console.log("reso "+ resp)
        if(resp != undefined ){
          var rol : Irol = {} as Irol;
          rol.cedula = resp;
          rol.app = environment.app;
          this.authService.obtenerMenu(rol)
          .subscribe((data) => this.setMenu(data.lstMenu.menu));
        }



    }else{
      if(m.menu != undefined){
        this.setMenu(m.menu)
   }
    }



  }



  private setMenu(menu: Menu[]) {
   this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private validarUsuario(){
    var has : any =  sessionStorage.getItem("hasToken");
    var cedula : any;
    if(has != undefined){
      ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
      cedula = decrypted.toString(CryptoJS.enc.Utf8);
    }
    return cedula;
  }
}
