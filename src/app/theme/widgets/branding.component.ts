import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="matero-branding" routerLink="dashboard">
      <img src="./assets/images/LogoSolo.png" class="img-navbar" alt="logo" />
      <!-- <span class="matero-branding-name">DIREM</span> -->
    </a>
  `,
  styleUrls: ['./branding.component.scss'],
})
export class BrandingComponent {}
