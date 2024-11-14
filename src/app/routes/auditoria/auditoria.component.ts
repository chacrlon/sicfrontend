import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, Inject, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { auditoria } from 'app/models/empleados';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import { SpinnerComponent } from '../sessions/login/spinner.component';
import * as moment from 'moment';
import 'moment/locale/pt-br';

const ELEMENT_DATA: auditoria[] = [];

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class AuditoriaComponent implements OnInit {
/*-----------------------------------------**-------------------------INFORMACION A AUDITORIA----------------------------------**------------------------------------------*/



  displayedColumns: string[] = ['id','accion','descripcion','usuario','fecharegistro','idregistroauditoria']; //'accion'
  dataSource: MatTableDataSource<auditoria>;

  form = new FormGroup({
    fechai: new FormControl(null, { validators: [Validators.required]}),
    fechaf: new FormControl(null, { validators: [Validators.required]}),
    //accion: new FormControl('' ,{ validators: [Validators.required]})
  });

  public audi : auditoria = {
    nombreoperador: '',
    tipooperador: '',
    idauditoria: '',
    fechaaccion: '',
    accion: '',
    idregistro: '',
  };



  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;

  private overlayRef!: OverlayRef;

      constructor(public dialog: MatDialog,
                private router: Router,
                private EmpleadoService : EmpleadoService,
                private dateAdapter: DateAdapter<Date>,
                private changeDetectorRef: ChangeDetectorRef,
                private spinner: NgxSpinnerService,
                private formBuilder : FormBuilder,
                private componentFactoryResolver: ComponentFactoryResolver,
                private cdRef : ChangeDetectorRef,
                private overlay: Overlay ) {
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          this.dateAdapter.setLocale('es-ES');

      }

   ngOnInit(): void {
    this.spinner.show("sp1");
    this.show();
    this.busquedaAuditoria();
    this.spinner.hide("sp1");
   }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   ngAfterViewInit() {
    this.setInitialValue();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
/*-----------------------------------------**-------------------------BUSCAR INFORMACION A AUDITORIA----------------------------------**------------------------------------------*/
  async busquedaFechas(){
  this.spinner.show("sp1");
    await this.EmpleadoService.consultarAuditoriaFecha({
      fechai: moment(this.form.value.fechai).format("DD/MM/YYYY"),
      fechaf: moment(this.form.value.fechaf).format("DD/MM/YYYY")
    }).subscribe(
      (data) =>{
       // console.log(data ,":::AQUI")
        if (data.code!=9999) {
          this.dataSource = new MatTableDataSource(data.data);
          this.ngAfterViewInit();

        }
        this.spinner.hide("sp1");
      },
      (error) =>{
        this.spinner.hide("sp1");
      }
    );

  }

async busquedaAuditoria(){
    this.spinner.show("sp1");
    await this.EmpleadoService.consultarAuditoriaFecha({

      fechai: moment(new Date).format("DD/MM/YYYY"),
      fechaf:  moment(new Date).format("DD/MM/YYYY"),
    }).subscribe(
      (data) =>{
        this.dataSource = new MatTableDataSource(data.data);
        this.ngAfterViewInit();
        this.spinner.hide("sp1");
      },
      (error) =>{
      }
    );
  }

  protected setInitialValue() {}

/*-----------------------------------------**------------------------- HERRAMIENTAS---------------------------------**------------------------------------------*/
  handleClear(){
    this.form.patchValue({
      fechai : "",
      fechaf:  ""
    });
    this.busquedaAuditoria();
  }

  public show(message = '') {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }
    const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
    const component = this.overlayRef.attach(spinnerOverlayPortal);
  }

  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }
 }
