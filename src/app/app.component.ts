import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService } from '@core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InactivityTimerService } from './routes/servicios/inactivity-timer.service';
import { AuthService } from '@core/authentication';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {

  typeSelected!: string;

  constructor(private preloader: PreloaderService,
              private spinnerService: NgxSpinnerService,
              private inactivityTimer: InactivityTimerService,
              private auth: AuthService) {}


  ngAfterViewInit() {
    this.preloader.hide();
  }

  // initiate it in your component OnInit
  ngOnInit(): void {
    this.spinnerService.show();
    // Usar check() en lugar de isAuthenticated()
    const isAuth = this.auth.check();

    this.auth.getAuthStatus().subscribe((isAuth: boolean) => { // <- Escuchar cambios
      if (isAuth) {
        this.inactivityTimer.startTimer();
      } else {
        this.inactivityTimer.forceStop();
      }
    });

  }

}



