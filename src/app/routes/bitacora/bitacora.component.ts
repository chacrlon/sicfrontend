import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { AuditoriaService, Auditoria } from './auditoria.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

// Define el formato de fecha que deseas
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
  providers: [
    // Proporciona el adaptador de fecha y los formatos
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BitacoraComponent implements OnInit {
  // Ajusta las columnas para que coincidan con tu HTML
  displayedColumns: string[] = ['idregistroauditoria', 'accion', 'descripcion', 'usuario', 'fecharegistro'];
  dataSource: MatTableDataSource<Auditoria>;

  form = new FormGroup({
    fechai: new FormControl(null, { validators: [Validators.required] }),
    fechaf: new FormControl(null, { validators: [Validators.required] }),
  });

  // Usa el operador de afirmación definida (!) para evitar errores de inicialización
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private spinner: NgxSpinnerService,
    private auditoriaService: AuditoriaService,
    private dateAdapter: DateAdapter<any> // Inyecta el adaptador de fecha
  ) {
    // Inicializa con un array vacío de tipo Auditoria
    this.dataSource = new MatTableDataSource<Auditoria>([]);
    // Configura el locale para español
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarAuditoria(): void {
    this.spinner.show('sp1');
    this.auditoriaService.consultarTodo().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.spinner.hide('sp1');
      },
      (error) => {
        console.error('Error al cargar auditoría:', error);
        this.spinner.hide('sp1');
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  busquedaFechas(): void {
    if (this.form.valid) {
      this.spinner.show('sp1');
      const fechaInicio = moment(this.form.value.fechai).format('DD/MM/YYYY');
      const fechaFin = moment(this.form.value.fechaf).format('DD/MM/YYYY');

      this.auditoriaService.consultarPorFechas(fechaInicio, fechaFin).subscribe(
        (data) => {
          this.dataSource.data = data;
          this.spinner.hide('sp1');
        },
        (error) => {
          console.error('Error al buscar por fechas:', error);
          this.spinner.hide('sp1');
        }
      );
    }
  }

  handleClear(): void {
    this.form.reset();
    this.cargarAuditoria();
  }
}
