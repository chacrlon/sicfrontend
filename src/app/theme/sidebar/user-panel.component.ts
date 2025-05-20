import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import { InactivityTimerService } from 'app/routes/servicios/inactivity-timer.service';
import { LoginService } from 'app/servicios/util/login.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <!-- <img class="matero-user-panel-avatar" src="./assets/images/scbdv.png" alt="avatar" width="100%" style="height: 70px;padding: 12px;width: 70px;" /> -->
      <mat-icon style="height: 70px;
padding: 12px;
width: 70px;
font-size: 41px;"> insert_drive_file</mat-icon>
      <h4 class="matero-user-panel-name">{{ user.nombres   + " "+ user.apellidos }}</h4>
      <h5 class="matero-user-panel-email">{{  user.descCargo }}</h5>
      <div class="matero-user-panel-icons">
        <!-- <a routerLink="/profile/overview" mat-icon-button>
          <mat-icon class="icon-18">account_circle</mat-icon>
        </a>
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon class="icon-18">settings</mat-icon>
        </a> -->
        <a (click)="logout()" class="btn-exit" mat-icon-button> Salir
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  user: IusuarioLdap  = {} as IusuarioLdap;

  constructor(private router: Router, private loginService : LoginService, private inactivityTimerService: InactivityTimerService) {}

  ngOnInit(): void {
    var has : any =  sessionStorage.getItem("hasToken");
    ​var decrypted = CryptoJS.TripleDES.decrypt(has, "CiSecret");
    this.loginService.usuario(decrypted.toString(CryptoJS.enc.Utf8))
    .subscribe(data => {
          this.user = data.usuario;
          this.user.nombres = this.user.nombres.toLowerCase();
          this.user.apellidos = this.user.apellidos.toLowerCase();
    });

  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
    this.inactivityTimerService.forceStop();

  }
}
