import { Component, OnInit, ViewChild } from '@angular/core';
import { Estadistica1Service } from './estadistica1.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-estadistica1',
  templateUrl: './estadistica1.component.html',
  styleUrls: ['./estadistica1.component.scss'],
})
export class Estadistica1Component implements OnInit {
  dataSourceMorosos: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourcePIC: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourcePCP: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild('paginatorMorosos') paginatorMorosos: MatPaginator | undefined;
  @ViewChild('paginatorShared') paginatorShared: MatPaginator | undefined;
  public maxDate: Date = new Date();
  public minDate: Date = new Date();
  totalTransactionsPIC: number = 0;
  totalTransactionsPCP: number = 0;

  displayedColumnsMorosos: string[] = ['collectorName', 'countCredit', 'countAccount', 'cuentasNotificadas', 'conCobro', 'cuentasNoNotificadas'];
  displayedColumnsPIC: string[] = ['collectorName', 'totalOperations', 'operationMessage'];
  displayedColumnsPCP: string[] = ['collectorName', 'totalOperations', 'operationMessage'];

  searchForm: FormGroup;
  isLoading = false; // Indicador de carga
  errorMessage = ''; // Mensaje de error

  constructor(private estadistica1Service: Estadistica1Service) {
    this.initVar();
    this.searchForm = new FormGroup({
      fecha: new FormControl({value:new Date(),disabled:false}, [Validators.required]),
    });
  }

  private initVar() {
    this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() - 3, this.minDate.getDate());
    this.maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 3, this.minDate.getDate());
  }

  ngOnInit(): void {
    this.setData();
  }

  setData() {
    this.searchForm?.get('fecha')?.setValue(new Date());
  }

  searchEstadisticas() {
    if (this.searchForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.searchForm.disable();

    const fecha = moment(this.searchForm.value.fecha).format("DD-MM-YYYY");

    forkJoin([
      this.estadistica1Service.getEstadisticasPorFecha(fecha),
      this.estadistica1Service.getEstadisticasPorFechaPIC(fecha),
      this.estadistica1Service.getEstadisticasPorFechaPCP(fecha),
    ]).pipe(
      finalize(() => {
        this.isLoading = false;
        this.searchForm.enable(); // Re-enable the form after loading
      })
    ).subscribe({
      next: ([dataMorosos, dataPIC, dataPCP]) => {
        this.dataSourceMorosos.data = dataMorosos.data || [];
        this.dataSourcePIC.data = dataPIC.data || [];
        this.dataSourcePCP.data = dataPCP.data || [];
        this.totalTransactionsPIC = dataPIC.data[0]?.totalTransactions || 0;
        this.totalTransactionsPCP = dataPCP.data[0]?.totalTransactions || 0;
        this.setupTableMorosos();
        this.setupTablePIC();
        this.setupTablePCP();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los datos. Por favor, intente de nuevo.';
        console.error('Error fetching data:', err);
      }
    });
  }

  private setupTableMorosos() {
    if (this.paginatorMorosos) {
      this.dataSourceMorosos.paginator = this.paginatorMorosos;
    }
  }

  private setupTablePIC() {
    if (this.paginatorShared) {
      this.dataSourcePIC.paginator = this.paginatorShared;
    }
  }

  private setupTablePCP() {
    if (this.paginatorShared) {
      this.dataSourcePCP.paginator = this.paginatorShared;
    }
  }
}
