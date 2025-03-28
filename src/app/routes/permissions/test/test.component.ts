import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-permissions-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class PermissionsTestComponent implements OnInit {
  comparedPermission: string[] = ['guest'];

  constructor(private permissionsSrv: NgxPermissionsService) {}

  ngOnInit() {}

  getPermissions() {
    return Object.keys(this.permissionsSrv.getPermissions());
  }

  addPermission() {
    // this.permissionsSrv.loadPermissions(['admin']);
    this.permissionsSrv.addPermission('admin', () => {
      // return false;
      return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => resolve(true), 2000);
      });
    });
  }

  removePermission() {
    this.permissionsSrv.removePermission('admin');
  }

  unAuthorized() {
   // console.log('unAuthorized');
  }

  authorized() {
   // console.log('authorizes');
  }

  changeToAdmin() {
    this.comparedPermission = ['admin'];
   // console.log("1| "+ this.comparedPermission);
  }

  changeToAnotherPermission() {
    this.comparedPermission = ['awesome'];
    // console.log("2| "+this.comparedPermission);
  }

  changeToGuest() {
    this.comparedPermission = ['guest'];
    // console.log("3| "+this.comparedPermission);
  }
}
