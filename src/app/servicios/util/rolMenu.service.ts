
import { Injectable } from '@angular/core';
import { IusuarioLdap } from 'app/models/usuarioLdap';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RolMenuService{

    usuario : IusuarioLdap = {} as IusuarioLdap;
    
    private menuInyectado = new BehaviorSubject<IusuarioLdap> (this.usuario);
    menuInyectado$ = this.menuInyectado.asObservable();

    set(user : IusuarioLdap){
        this.menuInyectado.next(user);
    }
}