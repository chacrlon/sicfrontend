import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService } from '@core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {

  typeSelected!: string;

  constructor(private preloader: PreloaderService,
              private spinnerService: NgxSpinnerService) {}


  ngAfterViewInit() {
    this.preloader.hide();
  }
 
  // initiate it in your component OnInit
  ngOnInit(): void {
    this.spinnerService.show();
  }
}

 

