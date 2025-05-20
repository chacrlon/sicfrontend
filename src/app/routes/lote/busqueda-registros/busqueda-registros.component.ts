import {AfterViewInit, ChangeDetectorRef, Component, VERSION ,  ComponentFactoryResolver,  OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import {MatDatepickerInputEvent,} from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs'
import { Injectable } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource} from '@angular/material/table';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { Router } from '@angular/router';
import { TooltipPosition} from '@angular/material/tooltip';
import { MatDialog} from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService } from "ngx-spinner";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { IDatosTrabObj, IDatosTrab, IEmpleadoServicio, registros, estadisticas } from 'app/models/empleados';
import { ISelectTipo, TransaccionesConsulta } from 'app/models/administrador';
import { EmpleadoService } from 'app/servicios/empleados/empleado.service';
import { ISelect } from 'app/models/departamentos';
import { usuario } from 'app/models/usuarios';
import { saveAs } from 'file-saver';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { Console } from 'console';
import * as moment from 'moment';
import { DepartamentosService } from 'app/servicios/util/Departamentos.service.';
import 'moment/locale/pt-br';
import '@angular/common/locales/global/es';


const ELEMENT_DATA: TransaccionesConsulta[] = [];

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};


interface Transaccion {
  estadoNombre: string;
  numeroCuenta: string;
  vef: string;
  montoTransaccion: string;
  tipoMovimiento: string;
  serialOperacion: string;

}


@Component({
  selector: 'app-busqueda-registros',
  templateUrl: './busqueda-registros.component.html',
  styleUrls: ['./busqueda-registros.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class BusquedaRegistrosComponent implements OnInit { //


  totales: any;

  displayedColumns: string[] = ['numeroCuenta', 'vef','montoTransaccion','tipoMovimiento','serialOperacion','referencia','codigoOperacion','referencia2','tipoDocumento','numeroCedula','id_lote','id_lotefk','fechacarga','estado_nombre'];
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<any>;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 2000,
    timeOut: 2000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild('container', {read: ViewContainerRef}) container2: any;
  private overlayRef!: OverlayRef;

  busquedaTForm: FormGroup = this.fb.group({
    fechai: new FormControl(null),  // Eliminar Validators.required
    fechaf: new FormControl(null),
    cedula: ['', [Validators.pattern(/^\S.*$/)]],  // Validación correcta
    monto: ['', [Validators.pattern(/^\S.*$/)]],
    numerocuenta: ['', [Validators.pattern(/^\S.*$/)]],
    numerolote: ['', [Validators.pattern(/^\S.*$/)]],
    estadolote: new FormControl(''),
  });



  constructor(public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>,
    private AdministradorService : AdministradorService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef : ChangeDetectorRef,
    private toast: ToastrService,
    private overlay: Overlay )
 {
  this.dateAdapter.setLocale('es-ES');
 this.dataSource = new MatTableDataSource(ELEMENT_DATA);
 }

  ngOnInit(): void {
    this.spinner.show("sp1");
    this.busquedaTransacciones();

    this.spinner.hide("sp1");
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  async busquedaTransacciones() {
    this.spinner.show("sp1");
    await this.AdministradorService.consultarTransacciones().subscribe(
      (data) => {
        console.log(data, "____________");
        if (data.code != 9999) {
          // Asegúrate de que data.data tiene montoTotal
          this.totales = data.data.montoTotal || 0; // <-- Valor por defecto
          this.dataSource = new MatTableDataSource(
            data.data.map((item: Transaccion) => ({
              ...item,
              estado_nombre: item.estadoNombre
            })) || []
          );
          this.ngAfterViewInit();
          this.spinner.hide("sp1");
        }
      },
      (error) =>{

      }
    );
  }

//------------------------------------------------------------------------------------------------- VALIDATION
numberOnly(event: { which: any; keyCode: any; }): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}


decimalNumberOnly(event: KeyboardEvent): boolean {
  const charCode = event.which || event.keyCode;
  // Permite números, comas (44) y puntos (46)
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) {
    return false;
  }
  // Verifica si ya existe un separador decimal
  const currentValue = (event.target as HTMLInputElement).value;
  const hasDecimal = currentValue.includes(',') || currentValue.includes('.');
  if ((charCode === 44 || charCode === 46) && hasDecimal) {
    return false;
  }
  return true;
}

// Manejar pegado de datos
handlePaste(event: ClipboardEvent, controlName: string) {
  event.preventDefault();
  const pastedData = (event.clipboardData?.getData('text/plain') || '').trim();
  this.busquedaTForm.get(controlName)?.setValue(pastedData);
}

// Recortar espacios al salir del campo
trimInput(controlName: string) {
  const control = this.busquedaTForm.get(controlName);
  if (control?.value) {
    control.setValue(control.value.trim());
  }
}

// Método de validación en el componente
validateDate(field: string) {
  const value = this.busquedaTForm.get(field)?.value;
  if (value && !moment(value).isValid()) {
    this.busquedaTForm.get(field)?.setErrors({ invalidDate: true });
  }
}

async busquedaTransaccionesAvanzadotxt(){
  this.spinner.show("sp1");
  await this.AdministradorService.consultarFechaTransacciones({
    fechai: moment(this.busquedaTForm.value.fechai).format("DD/MM/YYYY"),
    fechaf: moment(this.busquedaTForm.value.fechaf).format("DD/MM/YYYY"),
    cedula: (this.busquedaTForm.value.cedula),
    monto: (this.busquedaTForm.value.monto),
    numerolote: (this.busquedaTForm.value.numerolote),
    numerocuenta: (this.busquedaTForm.value.numerocuenta),
    estadolote: (this.busquedaTForm.value.estadolote),
  }).subscribe(
    (data) =>{
      console.log(data.data.data,"::::::::")
      console.log(data.data.montoTotal,"::::MONTOOOO::::")
      if (data.code != 9999) {
      this.totales = data.data.montoTotal;
      this.dataSource = new MatTableDataSource(data.data.data);
      this.ngAfterViewInit();
      this.spinner.hide("sp1");
      }
    },
    (error) =>{

    }
  );
}

async busquedaTransaccionesAvanzado() {
  this.spinner.show("sp1");
  const formValue = this.busquedaTForm.value;

  let monto = null;
  if (formValue.monto) {
    const cleaned = formValue.monto.replace(/\./g, ''); // Elimina puntos de miles
    const numericValue = parseFloat(cleaned.replace(',', '.')); // Convierte coma a punto
    if (!isNaN(numericValue)) {
      monto = Math.round(numericValue * 100); // Convierte a entero (centavos)
    }
  }

  const params = {
    fechai: formValue.fechai ? moment(formValue.fechai).format("DD/MM/YYYY") : null,
    fechaf: formValue.fechaf ? moment(formValue.fechaf).format("DD/MM/YYYY") : null,
    cedula: formValue.cedula || null,
    monto: monto, // Enviar en centavos
    numerolote: formValue.numerolote || null,
    numerocuenta: formValue.numerocuenta || null,
    estadolote: formValue.estadolote || null,
    timestamp: new Date().getTime() // Evitar caché
  };

  await this.AdministradorService.consultarFechaTransacciones(params).subscribe(
    (data) => {
      if (data?.code !== 9999 && data.data) {
        this.totales = data.data.montoTotal || '0';
        // Actualizar datos sin recrear el dataSource
        this.dataSource.data = data.data.data.map((item: Transaccion) => ({
          ...item,
          estado_nombre: item.estadoNombre
        })) || [];
        // Actualizar paginación y ordenamiento
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.spinner.hide("sp1");
    },
    (error) => {
      this.spinner.hide("sp1");
    }
  );
}

async  exportToExcel() {
  const title = 'Reporte de Transacciones';
  const header = ['numero de cuenta', 'vef','monto de transaccion','tipo de movimiento','serial de operacion','referencia','codigo operacion','referencia2','tipo de documento','numero de identidad','id de lote','id de registro','fecha de carga','estado_nombre'];
  const data:any[] []= [];
  this.dataSource.data.forEach((data2)=>{

    let newArray: any[]=[];
    newArray.push(data2.numeroCuenta,
       data2.vef,
       data2.montoTransaccion,
       data2.tipoMovimiento,
       data2.serialOperacion,
       data2.referencia,
       data2.codigoOperacion,
       data2.referencia2,
       data2.tipoDocumento,
       data2.numeroCedula,
       data2.id_lotefk,
       data2.id_lote,
       data2.fechacarga,
       data2.estado_nombre // <-- Usar el nuevo campo
       )
       data.push(newArray);

  });


  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Reporte de Transacciones');
  const titleRow = worksheet.addRow([title]);
  titleRow.font = { name: 'nunito', family: 1, size: 16, bold: true };
  worksheet.addRow([]);
  worksheet.mergeCells('A1:B1');
  worksheet.addRow([]);
  worksheet.addRow([]);
  const headerRow = worksheet.addRow(header);
   let logoBase64: string = "data:image/png;base64,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UifHi8tlEokEXV1dPPjgg8yZM4disWgqnkiypKenh3K5zKmnnsrRRx+9W9f0Xi3OmMRtkjjcUUcdxbx580zsSQa4ALFlWbz11ltGdgEYRuu6LieffDILFy6sWsECA+zTsixefvllent7DZgIWMaTS08++WSVzlCypqVSyUiEDjnkEIYPH/6+LswXlvarX/2KefPmGSAoFosUi0XeeustJk+ezJVXXskxxxxjXNP99tuPiy++mO9973s8/PDDNDU18eqrrzJ9+nSz4iZ+D2PGjKkCIGlnufdCoYDneeTzeUaNGsUNN9zAzTffzFlnncVBBx1EoVBg9erVHHbYYUbrec0113DTTTdx/vnnM2nSJJqbm3n++edJp9PccccdVZOuWHwSHDZsGLfddhtf/vKXOffcc015tFdffZXPfvazrFq1iu7ubmzbNrHD7373u3z961/n0ksvpaGhgXHjxrFx40by+TxTpkyhqanJxIzfSd7117LdBEHwQo1rJ4AgWgKSaiPbeByFTVsI7B5cVYr84jDaQU6rECyRRPcnRgAVanAdwtAl0LU4yRbeaM9R8BRFFYLj4PkRYyyFkGloYcHajbwOHHjqqbzws58zLpXGKVXI54o4brrfTbewAk3FDik6mnHjo8IJQRBi23s2WJ577jm+973vGSmCuI4iSRDZS6FQYPPmzaxdu5ZkMkk+nzcK+oaGBnbs2EE6naa+vp7DDz+cb33rW0ZnKKA6uDPGY1G7a/FKwPEAvwzAAw88cKeCmVC9P4rneWzbto1Ro0aZQS4C5iOOOIKamhry+bzRQArAyWDq7e1l6dKlnHzyyVXVVeKDcOHChcZ1ii+5Esady+U46aSTquJX75ddc801Jk4pSa4gCKirq6O1tZVkMkkqlTIJHYgA7POf/zxnnHEGzz33HLlcjiuvvJKmpiZyuZxZvui6LnV1dVxyySVMmDDBhBNgICnyrW99i/33398U1tBac/jhh3PvvfeyatUqXn31VYYPH86HPvQhxo4dC0TMsVgs8o1vfIOLLrqI1157jW3btvGP//iPHHzwwebe4gmmuHJB+ua4ceOYM2cOr7zyCi+99BItLS18+ctfZsSIEbzwwgsMGzasam14Npvle9/7Hm+99RZvvvkmPT09ZDIZDjroIFpaWgDMEs74lgTvl71nEDTdzA8gkUBjUfFLJJ0aSB9GOrWWsLIBrXqjYJy2gBCsIFrepkAH/Uwwdlw/tNGqjkR6JBvWd4GdoVAMsBLRfiaWcinlc1RqU2yvJLlr3hK+85kTee6J/yG3dRuO7xOGPqlEkmI5xFEWhD6+rcknoKV/uVzUmfZ8wCxevNgE9AWUXNetinNI1kzAplQq0dTUhG3bbN26leHDh1MulznzzDO59NJLzTEGA5/8HeyW7q4JaxLwGMyimpqaDIuDnZdMifu+fft2Ro0aVcVUbNsmnU4zadIkli5dWuUyDj7Wk08+ycknn2x+GwfD9evXGx2cfCYCYlkTm8lkOOqoo6ra6f0CwwMPPBCorkweL8EWvx95nrLmuba2llNOOaWq3ZVSRjkgk8qpp55atQwyLiYXSUn83qW/TZkyhSlTphhAkaSb67qk02kqlQptbW1miaG4oOIex5N58mzj7r5cz6RJk5g0aRKyRBTgsMMOq/pOfHy0tbXR2tpaBXLC/iSW/n4DIOzmbnPoEFtZ8j90QgFJYDw1w44C3UpIbSTW0wGoEhqPUPfXSVBSL094oSbAIqAWOz2cdRs7CKwUKAdlO+gwihsqN0Hegz5qePyFNawOYL8z/4G+MAA/mkmwFE5o9Qu2Fb5lUUxoEh9qAwWubZsldrtrtbW1+L5PuVw28RnpCEopcrmcibNJ/KO2ttYUJejo6KClpYUwDLnsssv453/+5ypWGbfBA9oApNr9TFocZGV9pwTKxYUX9iFB7jhDE9YoyZ1dVdv+h3/4B8NkhQ0OjpuJ6yQdP35dzzzzjEkSCGDH2yQIAqZOnUpTU1PVed+PuKA8cxjYT0NeC9DBwIQWb1sRRwuzzefzAFXPP75tQTwpJO/HmXWpVDLtJmEHOabEFrPZrFnFBBhNqQBXIpEwLmwchCQUIsePZ6OlcIeInMWNlbbYunVrVd+JF3wQYBVZl6x5F+nT+2276ReG2I5FoKN6Mcpy8XAgaIDsQQThvmg9Cm05YHmgQ3R/JRnzT0XLPaJYYUigbQJVh+W2sHFrF6UQcG20DvD8sinxXglBJ+tox+XWx59iyvkn44wagee6aAWVfBFbR6tJwMKzoJiwYXjTO9/Se7B8Pm+qa8jsJR0ykUiQTqfJ5/Mkk0nq6+uNELampsZU9ahUKuTzeWbPns1nP/tZnnzyyap1sLtiM9GAeuf9Td6NifwkvtpDgvtS9020ZvEqJXINMoCEOcj7kiTyPI/p06ebQSjZcpF+yPFyuRwrV66scrUgGnx//OMfqwZhIpEwmUeI9G9ScACqdzz7a5skIwYPWJlMpAiFhD7iFXxkiaMwPBFGC9j9pQyphF2ELYrLLWAn7ufg7/q+TzqdNsAn/Ve0hg0NDeazwVIVua+4JRIJs0hAfhePEbe2tlYVmIjrSoX9Sv3BeOXtvw8mqC1kE3SlhMdZaJJgO0ADjePPJN/bRoBDaIeQUIQ6+pllRYVUtQYdeETtERJqhaezKJpZt3EHdjoLloXnlUmlkliWolIpoSwLz1OEiToeXbGSFXmY/MmPswMIQosEVlSxBtC2Reg41LQ0Q319xJ7CPc+wSlxOVg7kcjlT0kmKFEiHj++vIEAoTCaVSmFZFps2beKmm27i2muvpbe3F8B0TvmuAOPe0lLJ9e4KbMMwNINCrh8wE5GU7dK6uoSUuD7CgqdPn24E1tls1jARaZtSqWQYXzxDvXnzZtasWVMVi9Jam1US8t6MGTOqki17y96ujQezzHjdRLk3uQ4BY9kgSxie6OpkTbWcTz6Lx03jrrYApciE4kmUZDJp+l68j8RF0cIiZcIWoI0nIuJsDQaq5YhaYbA7LPcrgB6fgCTWLH1CNvWSz+T30gfjwuy4ZnDwRDM4USTtEn82u1JSvJO6Yjd7jhX7adhfDtCKtj/XNaAn0jjsKEp+ChLghQosB9dSBCGEYX9ZUwXK6q+w4CRwEs1UqKGz16NYCQjRKEujdAChj7KkkECSPi/Ez9Qz+3/mM/LjH6U4soVE/8BVSuOH0Rpj31I0j2kD25Kihrt3yzGTQZvP56v2oI1r1eRhSV1BGCibJQ+6WCxSKpVMZuy5557j3//93+nr6yOVSpnfxTWIrrv3FfW7ksBIPCu+IkY0gvHkTfwYcq0yqI8//ngzCIURwICsyHVdli9fbpiEfL548eIqMbVo2QSEfd83yZfBVUf2ts4sCAJTtCI+yGULBVnCKMUd4lsXyMAUkIoP7LgMKq4wkN9JG8pkIUAW37Y0vkZc2lPeF5PzxEML8i/+vfhEK9+Nl0orl8tm9VNcPiN/pa9DpE0cfH/xCkCD15XHmbAIuwXs5Z6KxaIRx0ufjOtM420YTyrKBBS/t8G2h3VrfBQ6BocamzSo8VjNRxNsegLf6ulPnNhYlgYviGQqEtrSOip4gIOd2Ifukk1vUVO0omUmlqXRYYAOArBCLAdCrUG5+L7D/D+/xOunncQh532a9bf9guGJBL4KouVyOJR9OGTiAREA+h4kHanesNt3nU6nOe200wybklk9rvmLlxt/7bXXWLduHb29vcZlkDhavO5asVjk6aefZsyYMVXVYOLL5aLZnohW72b8/90kD4TdSuYbBkAcoo4tRRvk/4Mz2kceeST19fXk8/mqQSYMMgxDXn/9ddavX8/BBx9sfr9w4UIDOgIYUt1G2vujH/1o1aDfm0xw8LFk0FYqFTZs2MCXvvQlkskkV155JSeeeKJZ/SCusJgM2vb2dq655ho2b97MDTfcwEc+8hHT/jKhxDP18ZCBFMWQtbnSt0SEDtUDP16kYTDoDZ7ohFnKMeL1G8VE0D94OVt8qwU5p3xncHxQWKucK5/PV/Ud+Q5gEl9yf7lcji984Qts27aNK6+8kpkzZxpSIBPF4PXN8de7uu7BIZM9AkEL3V+fRZihDbhAElJjyNQfSrHQgR/uwFU+Ohjgj1qywzpihoG2sJ06tmwr4ZNGWQlsu1+GqBUhUYkswn7eaVlYKk0hTPKjR5/mh+ccz8u/ehgv7ML2Kqgwcoe9IGT0+A/1b2oipaj3rJ5gW1sbV1xxhen88b0sBne+uBs0b9487rrrLrZt22aCyZI1VkpRW1tLoVBg7ty5TJs2rSoDCANBeMfZ8wH/TvcfhiG9vb1VjEBkP8KCK5WKWc0A1XvQSsmvZDLJEUccwTPPPGOOK20hLm0ikWDBggUcfPDBhGHIjh07WLduXZV7FBeiax3t0TJt2rSqe5DXewsMB1esAUxSq6urC9u2mTt3rnHJRbsoFmdsv/zlL9m6dSv5fJ4NGzZUVb8WIJekCgxMeqKxlKID8bjh4Ocl7R4HssFtEfdCZK2v2OCMdvz64uxJMs3yHGGgEIO4+XJcmdwlHizbIkjMUtop3g6DJ5FNmzaxYcMG2tvbef755znllFOq7jN+X/L8JRYtwC6sVyaUwfbee4za+b+R1Dl2OAsIs7hNx1Lx90fTQBCGhF6A2/+VATaoohqtKonr7sPmrXmUVYNWCcIQQj9AhRpHWdg6miE0PoQBGasGX2V5/MVXWdoJR33+M2xN+JSdENfW2CiU7eCMHhklr1OJPV4yB5j4FAzEbeIZzvi+FjKzW5bFqaeeyh133MGYMWPMDCvZMnG5xDVYsGCBcReEEcUDz38t01rT0dFhmNfgWGS8k7W2thpdpNyvvJZOevLJJ1dllOV4Unosm83y9NNPm5qFixcvNu6xdGKttSkOEQQBBx10ECNHjjRMY7CcY2+bMK9sNsvEiRNNLHf58uW88sorwEChgrhaQK7nkUceYdu2bWitmTFjhnFPZdKQLDtUM5VkMllVTCPednFXL762G6L1yPHJQ/4JeMQ9DGGgcq3xlU5x1i8ALNuwCvBLljuZTBoiICwz3i9EOiUmyZo4u5UxEF+CKMmV+vp62tvbq7LxYjL+4sAs8fp4KODt+sduJEYGXiqi4qiR/M+u/jhwwT6QVHIyjjssYnNhRMgCHa220xpQEUA4dppkehjbdxTxdYIgsAl8jfY1hDpaAqcUloYgLJFNu+R6S4Rk6CHJT/93Hi1nTUGNb6GkfHyvTOj5USeqrZMKDkTO957VE5QZXhicsCABrUKhUMVk4pKK4cOHc84551BfX286diqVMp1IfrNixYqqzGs8i7un9k7ZZ601L730UtWsKi6s/AuCgObmZsMMB8cGZWCKgLehoaFKxuE4jlkv7fu+qRQDsGDBAgOgAp7SgWXQz5gxY6e22Bsi8sEWB35ps6amJs444wxzH3PmzDGTAkRMRiarYrHIPffcg2VZjBgxgunTpzNy5Egzocn1i2wGBphXb2+vaTPZujSeKY9PsDJxyvXKemSR5QyO/QEmay3HtSyLQqFQBYaS3QaqEjcCiNJvZZmeHFeIQTwGLMAlvxXmGz9fHEjjjLJQKJiJJ85UZYuDwZtGxZMp8VDO4Dio2B76DmF/TNDBkuUgQKh8sDOgR1LTOAU32YLGxXUg6BdKh0RuriRZtHJRVg3bd+TxAwuNE2kDsbG0haUt0ApNgK19LEtRrgRYbg3aybB09VpWbyty6FkzIe1g+T62F9La3Ao1EDig0QTa3yONHQzEOhKJxE4ZMan1Jm6uyE3kYTlOtHeESBtkxpWHJ8vDNm/ebMoayXHl9V/D4iAXj8kJAMpruVapaBzPPEJ1PE0pRUNDA1OmTKkKuMeZibh+Tz31lMkKx48Tz6CWSiWGDRtmlhYO1hfujQkifh/xASTt4HkeZ511lqmcsnDhQjo6OqpcWbFsNsuSJUsoFov09fUxa9YssyJEJtJ8Pm+qxYgyQJacyTlFsykABBEwCFAIoMWTVRLGEGbmeV4VyEl7CWgBRvIVz3THV7tIf47HsOV5xtmrsHc5p6gjBm/ZKlIrGRvSt3p7e6v6e11dHZVKhZ6eHlPBW7yodDpt3HDJjsc9p/g9vF3SbLdignKogQKp/VoZJWLoEIsEeDVQMxHVsy8Br6OcgKCUx3FtfN2/z6b2UNoi0DYFXcO2XDdoJ9rW00mgwoDQt/urzoAmxE3a5Pq6aGhqoVQqYasEOe3w83nz+e4FH+flX/2WQn4rtg0tIxshJfvfKVAOEa/cc5NGjZfRgup9WWWQx10BKfuUSqXMdwQgkskkzc3NdHR0sH79eo444ggzW4u4NAj+Om6fgOCyZcsMU5P3hC2Inmvy5MlVs7IkPizLMmJc6cjTpk3jD3/4Q1USIN5OWmsWLVrEvvvua4rFxo8rLpPv+3zoQx9ixIgRZqWBsCApQLE3bHBmPB6WcF2XtrY2jj76aJ599lny+TwPPfQQF110kZEJSVv+8Y9/5IUXXqCuro4JEyYwZcoU81lnZycPPPAAjzzyiPEcRowYwYwZM/j85z9vAM11XV566SWuvfZaAO666y7Wr1/Pb37zG5YvX25is5/+9Kf51Kc+ZZaeyXXkcjnmz5/Pgw8+yLp163DdaD/oY489lksvvZTW1laUiirf/PSnP2XRokUGxHzfN/G79vZ2Dj30UC677DL23Xdf1q9fzxe+8AXK5TJ33HEHBxxwgCn8CvCzn/2MuXPnMnbsWG677TYymYzRltq2za9//WseeeQRtmzZYlYDnXzyyZx99tmMGzfOFI0QRq21prW11UwiMtb6+vp49tlneeyxx3jppZeqNJNHHnkkZ599NpMnTzZ9abCaAPaYCUpdqoHDaMBHUwHK2gaaSI84Fa0Poadg4aTAUgmswMZSQKBRQUCoUoSpfXl5ewVlg6vLEPgEKALbJbDd/mSJG0GYCin4ObQbuRUVkjz10hus3gpTLvg8m+pSbMsUady/EWwfi4AQi3AvFBSMZy13lVWLSxhg5xkoHlsR2YEMYq01PT09Rg4xWJ4iM53EaeQ8cXdI6+Ad/wmTjbsNcq6f/vSnRgweZw2WZRn3v1KpcPzxx+90T3E5jVgYhsyYMcN0zPgxBSRt22bHjh384Ac/MAUVJHscl1L09fVx2mmnAQMZSHGf5PXesHjcNR5Lix//s5/9rGFbc+fONS6r3LNSijlz5pg14+edd55p7/Xr13PxxRfz0EMPVUlttm/fzpw5c7jyyiur9qpZtmwZfX19dHR08IMf/ICvfvWrLFu2DIhc6UKhwE9+8hPuvvtu065KKfr6+vjKV77C3Xffzdq1a6t2f3vyySf5whe+wGuvvQZErPV3v/sd7e3tbNy4ka6uLjZv3symTZvYtGkTXV1dLF26lJdffhmlFM8//zy9vb1UKhWeeeYZwjA0myWVy2Xz+apVq+jo6DCJIq01l19+OXfffTcbNmwwfcr3fR566CGuuuoqU21GssRCGGQzMRhg3A899BA33HADy5YtM56TLKt85plnuOqqq0zc9u2SZu8ZDaLy+oMOoc2r/pKeUaTQTmSBWlDjqa8/nNBqphxa+F5/TEoT7dHuuGg7SY4E2/NlwIr2C9GRW6xV2L/CxMfSIaHnk3QTuK5DxffwtIVO1rKlorhn3mL2+ehhBBPG0TcsQ9PE0WD56LASiajDvTNQ4gNPasMJKMlfoeKSCRXwEVdCBk58VYbILOrq6uju7jYPLq6RErdBZkTZ1yEuYXknE7CWQS2da/369dx7773k83kaGxsNQMe3Dshms0ybNs3EncR2JSuRc9TV1XH88cdXVZOOu7sSJI8Hx6XzxzOMI0aMMLP6B22TJk1i5MiRQHQP8+fPN7pRy7J49dVXWbFiBYlEgrFjxzJt2jSjLb3pppvYsmULpVKJ//f//h+PP/44CxYs4Itf/CJKKdauXcvs2bMJgsCsLoKBlTQHHHAAP/nJT/jGN77Bsccea9jzvHnzjFjf8zzuvPNOVqxYwebNm5k1axaPPvooTz31FLNnz6a1tZXXXnuNW265xWzU/otf/IKvfe1rXHvttfzbv/0bN954I7NmzUIpRSaToampiaOPProqVi2gGpfaiDRMyEChUDDJj+985zusWbMGz/P41Kc+xcKFC1m8eDG33HILY8aMoauri+uuu64q8y+ZZXGZ4+63hFmmT5/OjTfeyOzZs7n11ls599xzDZudM2dOlRxosO0eJTJAGHPL+nXIwg0DHUZusu8ANajmA3DccZQqjXjawk5GwmkAS7k4dooSJfLFAmgbFbpYYRoV2igClCpiU8SmjB1oEqGLo1yC0MJXLgU7Sd7N8L9/Xs6bOThm1jmszeVg4kRQCltZOIEmoVS0890eWDwIDOyUcROGF/++ZKt6e3t56aWXyOVyVUwHBoTGUjVl5MiRBkClI4pLIVWbpcPLRu8Cuu/0z7Zts6mP7/tkMhnWr1/PBRdcQE1NDZlMhq1btxogjDPGQqHAaaedVuWSQPXucFAtooUoSyz3EWdUAngSEpABJuwonhSJA88HabI294orrjDbEPz3f/+3WaMbhiEPPvggEDHsM844w/SPZcuWsW7dOpLJJBdccAEnnHACmUwG27Y57bTTOP/8802sUZiNtFkymWT8+PHceeedTJgwgZNOOombbrqJ5uZmw7I3b95sWOATTzxBJpPhyCOP5Itf/KI5z8SJE/nqV7/KPvvsw5o1a+jp6TEZ2JkzZ/Lxj3+cU089lWOOOYalS5caYPva175GU1NTVYw4rgiQawVM0dT4896xYwcLFiygWCwybtw4rr76aqMF/PCHP8y//Mu/GO2o1DuMezzCDiVmGYYh5513HkuWLOHGG280u+ZNnTqVCy+8kNraWpRSZmkmVG9ZIbaHYul+NNGie4n2CgGwlARUXSy7HqyRZGom09nVjqs2o1yfoNBflstPYKdrKZQ90IpQRUvx0A6W9glUEaVKKHxQYNsJKhUfZSlcJ0WoEpR9n4aGJvo6K9z7+NNcf8HxjHpqCgwbBtrvvx4rCg5ae1ZtROIeMtMIsMQZTrzkuCRKtNbU1dXxwAMPmOVo4obGl7Cl02lyuRz7779/1XmlsktdXY3ZUEkARDqcXNc7mVLRWlFx5+677z7uv/9+I8qNZwulrL9kPIcNG1alc5PzyWAYXNZKguATJ06kpaXFyDcGrkXtBJxxaUV8AMyYMcMMjA/SpDbfscceS2trK6+++ipvvPEGy5cv58ADD6RYLDJ//nxs2yaZTPLJT34SiO5r4cKF5vrHjh3Ltm3b6O7uBqKsbm1tLa7rsmPHDrq6umhoaEApZSbSadOmmXgzRCA7evRoXnzxRaNFdByHpUuXmu0RDj/8cDZs2GAq78RXtBSLRRYsWMC5555b1f5hGHLHHXfw6quvopTi+uuvN/vHxD0XYVjxxQIQSYbkGmWyXblypYkDn3DCCWzbts14Q5s2bSKdTps+vXz5coYPH27CLMIGYSAEkMlkjIeVTqfZvn07XV1d5HI5UqmUkdXkcjlzv7uKCe4BCA5C1EjNjNLRQjpXuQQB2JYLYR3YrdiNR5AsbcYrdxCGvf200SIMMzh2Iz09HliJfmwNBw6sPFAV6AdGbSeoeAHK1ygnCdj4AWg3jecmWPzKyxSs47ngK/8KCZvABSPiKRchvWeFGwcr9gcvg4KBgL64ecKufv7zn/PMM88YV092BotLS7LZLCNHjqwSJ0uHlcC3SB9EX5dOp6mpqWHTpk2MHj36Ha+/WCzS2dnJc889x0MPPcSbb75p3Lh4plDcb9/3qauro7Ozk+uuu46Ghgbg7cF2sHRFa22yxPPnz99lR4wz1bhuUn7f2Nhotnn8WzB59meffTbf//73cV2X2bNnc9ddd/Hggw+a5ZKf/vSnzR7TEqsS9//GG2+sqphtWdH6cilMINtWynNwXZdsNls1EcRDLsOHDzesvbOzkzAMqa+vZ86cOfzyl780WzjIZJrJZAyQxHezs+2oYOzDDz9MXV0dp59+OieddJKZcONaPWGJMkmKdyKqAdEiOo5De3u7IQ7/+Z//yezZsw2A1tfX09vbW5UIkb2TZXKWexPvxfd9Ojo6uP/++1m4cKGpzylxSRGEy/UUCgVDYOK2myDYn9mNHsPAy/6/jlJoiQ5aAC4E9eAeQE3DG3RsXUWp0o7jAFYCTQY3MYytbxWoBA7agpCAQPkEdkBE30DjEpDA00AqiQ4AP8DSmpQCv68XVcjT+bLQrAAAEtBJREFUG+QJUpAZaUMAgW0T4qM8HyuZZk/rCXZ2dvL444/T0NBgsrYCVLKyQvRQELkBf/rTn3j++efp7Ow0QCelt2SRvWQ5N2/ebOoLxlmSMLfe3m7jtgpYlEolnn/+eeOivZN1dfXQ2dlJU1OTScIAVcuj8vk8DQ0NZiB2dnYyY8YMU/8vXvJJbLBcKK6vSyQSVRWrpW3if+VepSCtJCTK5TLjxo3bqWzWB2XxrPZpp53Gr371K7Zt28bq1atZs2YNv/nNb4yG78wzzwQGJkoBhsbGRk444QTDyKVNRGe4zz77VG16JGApxw2CqExbfX29uaZ4DUjZAqBSqTBlyhSz94us+CgWiwZkTjnlFGpra819LVq0iF/84hdorZk6dSpXXXWVyZjLOm4BbQHgeIw8lUrR29tLsVikpqbGgJcIypVSHHLIIRx11FGm8no8flhbW8sxxxwDDKxj9zyP5ubmKv1gsVjk8ssvZ8uWLdTV1XHEEUcwfvx4WlpacByHhx56iO3bt5PL5QiCYJcACHvsDlugY66JuMJofEJsOyraogKwVD0wAqvuYFLd4/CKW3AT5Sj7G6ZIJppo7/QIdIJAaQKrTKAgsPxozbBOEOosWrsUKJFIONjlENsLcQhxlYdV6GVEfZrjJ+6Hm4CuLp+GYQ6yB5uPpsY2ap7dtu3bt3PbbbeZmoLxijDyWso+ySwmeq/GxkYDkNKxJPsp8aQJEyZw/PHHG2YpweBkMmkKZ2qt6erqMoPLdV1aWlqqRLZvZ1KEoVQqmdlfAEtm+NraWrq7u0mlUmSzWTKZDF/5yleqWEs8GB5ncfFYkYQKlFJMnjyZlpYWenp6qoBQbLDGLQ78J5544t+EKwwD2X+R8px00kncd999+L7PTTfdREdHh1nfvM8++wAYN6+5uRnLsujs7OSwww7jYx/7mDmugMtgQTBgltCJWN22bQOAwpxEj1epVDjooIPM821ububqq682IBcvgBFv02QyyWuvvcbNN99MPp9n6tSpfPGLXzRSlTj4y1agWmuzNwpgwijxeKBlWfT19TFq1CjTj1tbWzn33HPp6uqisbHR3GP8+qT+ougghQ06jkNXVxednZ10dXVRW1tLW1sbd955JzCwR/PcuXNxXddkrWGgiGvc9kArMiB0rrZobW+5lDNf8wPActDUAWOozR6MCkcRkKLsayqhheVk6SuG4GQIrAj8tOWhlSZQFiEuWqcJSfSvtvOwwxK1Vpls0Ee9n6NZFTly4mj++bJTCAOoG+YQEOLjobBwUmkqWg/sM7Kb1tTUZDbNljiGdKgwDOnp6TF7+Yq7Kp1IgroSSxSXWOi/7/tcddVVNDQ0VGWZBXziqyj4/9o7u9i2qjUNP3t72952nMRuEk5bM03tAtMfTU4zFEraDIFCOJqcpKKogqMImE4qhITK9AIVhKBcIRVRIa74UcUlF0hzAweJiQQXTFImVEKFqlCV0lNCgFKo2yR1nMQ/e++52P6Wl03ahoaLOVO/UuXWtb3ttdd61/fzft/C1xzKjm8YhiLcK/3J5XK0tbUp0pPrCHGLdSuJEcMwOHjwIK2trb+SBdVCEhmmaVbFjgCSySTt7e3qewBVC0UsC4kTiStu27Y65Pz/AvT7YhgGDzzwAPF4nGKxyOnTpwH/d+3evZtAIMD09DTgW4P9/f1Eo1E8z+PQoUNMTU1VdfAG+PLLL/noo4+UtS3JI2lvpicL5ubmaG1tVe4e+MoFORBpdnaWDz/8kNHRUUXeQoATExO89957SicomWv5zH379nHDDTeo+yWbMKAsvPn5eSYmJnCcivTq7bff5sKFCwSDQbLZrArVdHR0kEgkyGazjIyMMDY2pghQdKnffPMNw8PD5HI5pQ+1bRvbtpV+FSCRSHDhwgXy+Tyzs7OqEgf8DXxsbEydgyNxS5lLtbhGS9DUqK/8t3LrfCHBqG2Xm2yZBEL+wegQJUALtPTAudPM58/S0GhQcEyKnsvUpXmKrknRKOEYBgWngGEFCVlRvKJJoeRhmi6hkItZmCEeMLFmcwRLc9z2Tyke6nuQrvU2DeUf5lHEwSVU/o4mYJqGsgIlViELd6GAfq0i3nEcstmsqums7XcmkhXZtXW1uhCIuJpSLdDY2Egmk6GpqYnHHnuMO++8syrJINaQ3EzPq1QyCKlKvGcxtcXiPovVINeIxWJq4YXDYSYnJ7nlllvYv38/a9asUTt0rdRgoW4gMrYSP5Kzlfv6+jh69KhyyaSiRi/vkjgV+LG3DRs2VJHi5Qh4sdDvu1QyiOWqB/cXi+XLl9PV1cXw8LCaNxs3bqS9vR3HcZTFFg6Huemmm+jp6WFkZIRvv/2WoaEh0uk0N954I7lcjs8//5wff/yRSCTCunXrSCaTyirWk18yBpKdjkQiTE9Pq0Wez+fZs2cPr732GufOneOFF16go6ODVCpFPp/n9OnTfP311wSDQVpaWujq6uKVV17hzJkzymt5+eWXlSpBNqbt27fT29vLpk2baGtr45dffuHEiRMMDQ2xatUqMpkMX3zxhQrx6E1FIpEITzzxBAcOHCCbzfLcc8+xfv161q5dSy6X48SJE/z000/kcjkikQj33nsv6XSaeDyuqnIefPBBUqkUW7duZfv27WpjGBkZ4cCBA2zevJnx8XHeeecd1RhY4rASs1xyF5mKNNqsflIey/36/Nf5AmUpKPEvFwdnFU0re/jlx6+wjXkKmMTCQSYvTeNiUHJdwuEoATfA7Fye+XyRkGkRtUKEQwFm85eIhYoweYn1qX9g1+C/sWmdie2CrX5UHiiWrxrEr2spa9Mcj0DAqDLhdaGvSFVkBxSSFIvlaotEL9/RpR6C5uZmpXmSMqVkMsmOHTsYGhqqcofkc2Sn9Sf50iyiWCymxNW15V5iZeZyOe6++26efPJJdRaFkPjVfr+MnUBeH4vF6OzsVAkj27aVBEg+NxAIkMvlaG5uxnEcLly4wMDAwIKNO68VQoC1hLLYz5bNR8g7EAgwODjIJ598orSdjz/+eJU7D6j3PPXUUwQCAT744AN+/vlnMpkMY2NjVWWA/f396vxnvUVVW1tbVdci13XV2cbxeFyNaSgUor+/H8MweP311zlz5gy2bXPs2DHy+Tytra2USiVWrVrFrbfeSjgc5uzZs8oqzWQyapOWLjGBQIDGxkZ6e3uxbZtHH32UQ4cOkclkmJiY4IcffiCTySjZz+HDh1UcUTbbvr4+XNfljTfeYHx8HMuy1BnWtm1z/vx5Nm3aRHd3t9p09+zZw0svvUQ+n+fSpUscP35cJf+ef/55XnzxRS5evMjhw4cZHh4GUMe+fvrppySTyarQ0pJJELQl+Kv6OVnouqXg1vy7AUo3Qnwz4cn/Jjt/Cs+yMbGYyk3jeRFsO0oh7+AWXWLBMOFgAGcuB3PnMAoObdYsKyJhhv5jF/fe3uwf4elBgwlOcc7v5lW2AsHEwvVjl+VgoOP6Wh5dy6aLkHWXTshIFupiCvV191i6aUi2zLIsZmZmCIfDKobT2dnJww8/rOpx9U4eUlIElbrMQmH+stdeDETcbRiGKucTXWMkEiEej/PMM88oKYxMRr3L9JWwkKUoJLdixQo6Ozv57LPPFNlXLNxKaZrn+bWlTU1NbN26VcVQr5b0WSykjZdAFofc9ytBwiB6giCdTrN7924mJiZobW2lo6OjSsYkHoLE7p599lkeeeQRjhw5wtGjR1X5W2NjIzt27FCyKiGz8fFxQqEQ3d3dqiwRfELesWMHy5YtIx6Pk0qlmJmZUXNm27Zt9PT0cOTIEcbGxpicnKS5uZlQKMTAwIBqYVYoFNi7dy+jo6NVFrdYc1K6uXbtWiVw37lzJ6lUimPHjnHy5Eni8Thbtmyhp6eHr776iqamJlauXKkIS97X39/Pli1bGB0d5dixY6rQIJVKcd9995FOp9Xmkc1m6e3tJZlM8v7776sT+QYHB2lsbKS7u5u33nqLjz/+mOPHjxONRlm3bh0DAwN89913rF69mptvvlnNr4Xa9xve1aLoC0F/h6Fzoe8K689Ir0H/WRcL0zfSrAnI/yfjZ/6LcEOM1tS/89DB8/zP31rIO/6iMHAJGh6hgIPp5IkZDq0NFn+5v5c/bV1JwoCZaYg0gm36jB6iCOTxcCniO+6WFwQ3SJXrblbKm8T1LJVKnDx5kr179yoxsgyarue72iKRBph6Kx+9XVFDQwOGYXDbbbdx//3309HRUUW2QpiSQAkGgxw/fpynn36a77//nmXL4r/5lulwnIr2SiQ8iUSCO+64g66uLrZt26ZiQEIOOvEv1mLSkyT+dX3L99133+XNN9/k/Pnz6mzaYDCorI5oNMr09DTBYJB77rmH/fv3qw3oamO/WOi1zfv27ePgwYO/ev5q75U6VqmakDb7sgkK0eqv03WlMi8kfirQg/d6Pa4OvQuNkIVIawR63FWUCAsR/0IQEtTno75B1G5KIp/Ra8zF05DkocRC9Q1IxkvGFVCVNVK3LGO70PeTRxmn2nCJ6Alrr6tjacGVMgG6ZU2fuMmGZvmVbS0CoGQzWEAxDNFbCUXOMzuXwaCV7KXvCeDREAwTMF2CXgm3kIW5KZYnovz5ri3s/NeNtIZ9Yy/qQawJSuXGDUHAdVzMQBAXt0zFZvn8Yyq+vFHt/slEsCyLdDpNX18fU1NTKtOquzUSy7oSZIILcdq2TUtLC8uXLyeRSLBhwwaSyaSKFUElw6pLbfSbmU6nGRwc5NSpU0xNXby2+1VGItGCaZokEglWr17NmjVr1PeRSS4HRUlWTmqbxS1aDGrdQXGnBwYGOHv2LOPj4+TzedVpWCxB0UEmk0l27dpVdb3f64BunejEBax9/krv1cW6+saoL2ixcvWFp4deJLssry+V/MOQJL4bDocVAUq8V/ScehNUcVOhMj5yRINIcoRE8vm8is/JuEoHFlEq6M0oajvTiAZP7wytN5yQJJ/8v2ymAvl8IT+RBIkOUr6PJPtkfGQ8dEWFTni1BQzZbJampiY1ry4nlIalWoIG+CeBVNxgo5w0UadpGpTd5MprPEycwkWs0CTuzGlO/e1TbvrjX9jy5F/5qbAGp1iiIQzuXIZ41KFv22Ye2n47y0N+b9QQYHkuZsGjUCzi2BYhy8LyYG5mhkgshmPgy3QAq2T6ly8XjWBUlO56LLC2nEs6WcjirU2SXA4Lxcz0OJlkwqBiVcj1REsmpKhbgyCtyZdGAnNzeeWa11pWEnsUaYI+gfVd+0rQrSl9nHVcvHiRZcuWqdfIBNWvoRMNLI6gFgN9Y3Ndl3379vHqq6/+pioi3eWU98kh7EJuC1lakpTSyVL/XXp3HN3ChOojMPXvKSEXeZ0+hmK9eZ5//one/Vqst9pxlXko92yhMantQK23ydI/Xw+h1I6H3pIOUNafbIISEpD36GOuQ9630PyUDLbIZBb6LUvUCQKazQVla9DT/lSe9WE4OMxhhELg/gGzIc6yuIPLHyjMW5imgeeViFqw9a6N7PzzFv6xDSIAeYdoOIDJHIbhQtAkHLRwTIvZuQLBgkekIeaf9S7VKOq6QEBVzf1K5yaPkjGVGI6OxSYG9C7AugRE/xyoEKPcaN21kNfXuqK+i7C04me9K7bskLprJd9DF05Ho9GqUsAroba/oIQCJMsJKAIU0pXNRY4rFW0iVJPfYq6/GIgb6jgOK1asUBbEYoi2VCqpTLockSnxVT2+LMJeiTXLuOgLVbf8RQ6iE5/emmt+fl6FUkQcLWOqz83aprTyPfX7rifuZP7L99Dnvb425LfpSSXJ5NauC1lD0g1cpFe626xrIS3LUvXPIo3RFRaiXtDHSowEcZvFQxBZmiQldStR90wEvwMJVnePqaIH+UeNOtnBJYCJW7QxrSg3rPhnposBms0iuBm6/+V2/nTXH+lM+1afgW8BRsMBDK/gq6/x/CuXSpQMh1jExgjis5zlW6KGUabfsnzH52UXx63uKKgvKrkJetJEFoy+iK+ExUg4xAKQRSQTTLeKZLJKPGahXftasFAcSu8HKNeWeI6cZ/tb3GAh7tpyQnEDJeMYDoerFqdpmmpSy8LSH38PApSMtHRGbm9vr4pdXg0ybvJdhPRqNzc9RgjVlpBeaikEIb9Z3wx1aZTcB33D0h8l5qxn/PV7LGOvd3Su9YL0OLBcVx8bmSNCutKIVZeQ6bpPQHkWeshH3Hr5TN1ilfiePnf0xJlcS6xmIXkhRT1cIr/vcrFVuFZ3WINXZZWUf9SVPtGouM+GV75BRhGPALOYiM0TQBlv6rF8q6k0bgAMTbBdc10RRRua+77UapE66qjj/xeWTIJ11FFHHX/P+H30BnXUUUcdf6eok2AdddRxXaNOgnXUUcd1jToJ1lFHHdc16iRYRx11XNeok2AdddRxXaNOgnXUUcd1jf8FpNZVQ2zjvdUAAAAASUVORK5CYII=";

    // Add Image
    const logo = workbook.addImage({
      base64: logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A2:A3');
    worksheet.mergeCells('A3:C3');


headerRow.eachCell((cell, number) => {
cell.fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: '4A96D2' },
  bgColor: { argb: '4A96D2' }
};
cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

  data.forEach(data => {
const row = worksheet.addRow(data);
row.font = { name: 'nunito', family: 1, size: 9 };
//const qty = row.getCell(2);
//let color = '4A96D2';

/*  qty.fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: color }
};*/
}

);  worksheet.getColumn(1).width = 50;
  worksheet.getColumn(2).width = 50;
  worksheet.getColumn(3).width = 50;
  worksheet.getColumn(4).width = 50;
  worksheet.getColumn(5).width = 50;
  worksheet.getColumn(6).width = 50;
  worksheet.getColumn(7).width = 50;
  worksheet.getColumn(8).width = 50;
  worksheet.getColumn(9).width = 50;
  worksheet.getColumn(10).width = 50;
  worksheet.getColumn(11).width = 50;
  worksheet.getColumn(12).width = 50;
  worksheet.getColumn(13).width = 50;
  worksheet.getColumn(14).width = 50;
  worksheet.getColumn(15).width = 50;
  worksheet.getColumn(16).width = 50;
  worksheet.getColumn(17).width = 50;

  const footerRow = worksheet.addRow(['Sistema GIOM']);
  footerRow.getCell(1).fill = {
type: 'pattern',
pattern: 'solid',
fgColor: { argb: '4A96D2' }
};
  footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

  worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

  workbook.xlsx.writeBuffer().then((data: any) => {
const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
saveAs.saveAs(blob, 'ReporteTransacciones_'+ moment(new Date()).format("DD/MM/YYYY")+'.xlsx');
});

}


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  clear() {
    this.busquedaTForm.reset(); // <--- Aquí el cambio principal
    this.busquedaTransacciones();
  }
//------------------------------------------------------------------- Buscador General
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue!="") {
    }else{
    }

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 async exportTotxt(){

  console.log("antes de ejecutar")
    this.spinner.show("sp1");

    await this.AdministradorService.descargarTxt(
      moment(this.busquedaTForm.value.fechai).format("DD/MM/YYYY"),
      moment(this.busquedaTForm.value.fechaf).format("DD/MM/YYYY")

    );

    console.log("despues de ejecutar")


  }

//------------------------------------------------------------------- Spinner
  public show(message = '') {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }
   // const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
   // const component = this.overlayRef.attach(spinnerOverlayPortal);
  }
  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
