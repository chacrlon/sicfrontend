import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactory, ComponentFactoryResolver, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Irol, LoginService } from 'app/servicios/util/login.service';
import { MenuService, StartupService } from '@core';
import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';
import { SpinnerComponent } from './spinner.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';  // Asegúrate de tener esta importación
import { SessionService } from '../../servicios/session.service'; // Asegúrate de ajustar la ruta
import { InactivityTimerService } from '../../servicios/inactivity-timer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isSubmitting = false;
  hide = true;
  loginForm = this.fb.group({
    codUsuario: ['', [Validators.required, Validators.maxLength(7) ]],
    clave: ['', [Validators.required]]
  });


  override = {
    positionClass: 'toast-bottom-full-width',
    closeButton: true,

  };

  rol : Irol = {} as Irol;




  @ViewChild('container', {read: ViewContainerRef}) container2: any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private loginService : LoginService,
              private menu :StartupService,
              private resetMenu : MenuService,
              private http: HttpClient,  // Asegúrate de tener esta línea
              private renderer: Renderer2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private sessionService: SessionService, // Inyectar el servicio
              private cdRef : ChangeDetectorRef,
              private auth: AuthService,
              private inactivityTimer: InactivityTimerService ) {
//#region css body

              renderer.setStyle(
                document.body,
                "background",
                '#FDFDFF',
              );
                renderer.setStyle(
                  document.body,
                  "background-image",
                  'url(assets/images/fondo-login.png)' ,
                );

                renderer.setStyle(
                  document.body,
                  "background-position",
                  'revert',
                );

                renderer.setStyle(
                  document.body,
                  "background-repeat",
                  'no-repeat',
                );

                renderer.setStyle(
                  document.body,
                  "background-size",
                  'cover',
                );




//#endregion

  }
  ngAfterViewInit(): void {
    this.loadComponent();
  }

  ngOnInit() {
    sessionStorage.clear();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

  // En LoginComponent
private loginSub!: PushSubscription;

ngOnDestroy() {
  if (this.loginSub) {
    this.loginSub.unsubscribe();
  }
}


login() {
    if (this.loginForm.valid) {
        const username = this.loginForm.get('codUsuario')?.value; // Obtener codUsuario del formulario
        this.spinner.show("sp1");
        console.log("EL USUARIO ETERNO ES:", username);
        this.sessionService.setCodUsuario(username); // Establece el código de usuario en el servicio

        this.loginService.validarUsuario(this.loginForm.value).subscribe(
            (data) => {
                this.spinner.hide("sp1");
                if (data.status == "success") {
                    this.rol.app = environment.app;
                    this.rol.cedula = data.usuario.cedula;
                    this.obtenerMenu(this.rol, data);
                } else {
                    this.toast.error(data.mensaje, "", this.override);
                    this.limpiarFormulario();
                }
            },
            (error) => {
                this.spinner.hide("sp1");
                this.toast.error('Error en la comunicación con el servidor.', "", this.override);
            }
        );
    } else {
        this.toast.error("Disculpe, debe llenar los campos usuario y contraseña", "", this.override);
    }

}


  async   obtenerMenu(rol : Irol, usuario : any){
      await  this.loginService.obtenerMenu(rol).subscribe(
        (data) =>{
          debugger
          if(data.status == "success"){
           this.crearSesion(data, usuario);
          }else{
            this.limpiarFormulario();
            this.toast.error(data.mensaje , "" , this.override);
          }

        }
    );
  }


  async crearSesion(menu: any, user: any) {

    this.sessionService.setCodUsuario(user.usuario.codigo);
    await this.loginService.crearSesion(user.usuario.codigo).subscribe(
        (data) => {
            if (data.status == "success") {
                this.menu.load(menu.lstMenu);
                this.guardarCredenciales(user.usuario.cedula, user.usuario.codigo);
                console.log("EL USUARIO ES:", user.usuario.codigo);

                // Llama al método sendCodUsuarioToSpring para enviar el código de usuario
                this.sendCodUsuarioToSpring(user.usuario.codigo).subscribe(
                    (response) => {
                        console.log('Respuesta de Spring:', response);
                        // Aquí podrías manejar la respuesta de Spring si es necesario
                    },
                    (error) => {
                        console.error('Error al enviar el código de usuario a Spring:', error);
                    }
                );

                this.inactivityTimer.startTimer();
                this.router.navigate(['/dashboard']);
            } else {
                this.limpiarFormulario();
                this.toast.error(data.mensaje, "", this.override);
            }
        },
        (error) => {
            this.limpiarFormulario();
            this.toast.error('Error al crear sesión.', "", this.override);
        }
    );
}

sendCodUsuarioToSpring(codUsuario: string): Observable<any> {
  const url = 'http://180.183.171.164:7004/sic/api/processUser';
  const body = { codUsuario }; // Encapsula codUsuario en un objeto
  console.log('EL USUARIO PARA SPRINGBOOT ES:', codUsuario);
  return this.http.post(url, body, { responseType: 'text' })
      .pipe(
          map(response => {
              console.log('Respuesta de Spring:', response);
              return response;
          })
      );
}


  guardarCredenciales(xvalor : string, xvalorII : string){
    sessionStorage.setItem('hasTokenV', CryptoJS.TripleDES.encrypt("success","tkSecret").toString());
    sessionStorage.setItem("hasToken", CryptoJS.TripleDES.encrypt(xvalor,"CiSecret").toString());
    sessionStorage.setItem("hasTokenN", CryptoJS.TripleDES.encrypt(xvalorII,"tkcodSecret").toString());
    console.log("sessionStorage ES : ", sessionStorage);
  }

  limpiarFormulario(){
    this.loginForm.patchValue({
      codUsuario:"",
      clave:""
    });
  }


  loadComponent(): void {

        // create the component factory
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);

        // add the component to the view
        const componentRef = this.container2.createComponent(componentFactory);
        this.cdRef.detectChanges();

  }

  // login.component.ts
cerrarSesion() {
    this.auth.logout().subscribe({
      next: () => {
        this.handleLogoutActions();
      },
      error: (err: any) => { // <-- Añade tipo explícito
        console.error('Error al cerrar sesión:', err);
        this.handleLogoutActions();
      }
    });
}


  // Reemplaza el método logout actual con este:
  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.handleLogoutActions();
      },
      error: (err: any) => { // <-- Añade tipo explícito
        console.error('Error al cerrar sesión:', err);
        this.handleLogoutActions();
      }
    });
  }

  // Método auxiliar para evitar repetir código
  private handleLogoutActions() {
    this.inactivityTimer.forceStop();
    sessionStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
}
