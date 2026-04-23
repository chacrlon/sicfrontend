import { Component, OnInit, ViewChild } from '@angular/core';
import { MorosoService } from './moroso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-morosos',
  templateUrl: './morosos.component.html',
  styleUrls: ['./morosos.component.scss']
})
export class MorososComponent implements OnInit {
  dataSourceMorosos: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceMorosos2: MatTableDataSource<any> = new MatTableDataSource<any>();
  showNotificaciones: boolean = false;
  isSearchEnabled: boolean = true;

  @ViewChild('paginatorMorosos') paginatorMorosos: MatPaginator | undefined;
  @ViewChild('paginatorMorosos2') paginatorMorosos2: MatPaginator | undefined;

  displayedColumnsMorosos: string[] = [
    'account_number',
    'id_customer',
    'collector_name',
    'estado_cliente',
    'ultima_fecha'
  ];

  displayedColumnsMorosos2: string[] = [
    'dateCreated',
    'origin',
    'collectorName',
    'operationMessage',
    'operationStatus',
    'dateReceived'
  ];

  searchForm: FormGroup;
  loadingMorosos: boolean = false;

  constructor(private morosoService: MorosoService) {
    this.searchForm = new FormGroup({
      accountNumber: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.setupTableMorosos();
    this.setupTableMorosos2();
    // this.getMorososAll();  // Descomentar si se necesita cargar todos al inicio
  }

  public getMorososAll(): void {
    this.loadingMorosos = true;
    this.showNotificaciones = false;
    this.isSearchEnabled = false;

    this.morosoService.getMorososData().subscribe(
      (success: any) => {
        this.dataSourceMorosos.data = success.data;
        this.setupTableMorosos();
      },
      error => {
        console.error('Error al obtener morosos', error);
      },
      () => {
        this.loadingMorosos = false;
        this.isSearchEnabled = true;
      }
    );
  }

  searchMorosos() {
    if (!this.isSearchEnabled || this.searchForm.invalid) return;

    this.showNotificaciones = true;
    const accountNumber = this.searchForm.value.accountNumber;
    this.loadingMorosos = true;

    forkJoin({
      morosos: this.morosoService.getByIdCustomerOrAccountNumber(accountNumber),
      logs: this.morosoService.getByIdCustomerOrAccountNumber2(accountNumber)
    }).subscribe({
      next: ({ morosos, logs }) => {
        if (morosos.status === 200) {
          this.dataSourceMorosos.data = morosos.data || [];
          this.setupTableMorosos();
        }
        if (logs.status === 200) {
          this.dataSourceMorosos2.data = logs.data || [];
          this.setupTableMorosos2();
        }
        this.loadingMorosos = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingMorosos = false;
      }
    });
  }

  private setupTableMorosos() {
    if (this.paginatorMorosos) {
      this.dataSourceMorosos.paginator = this.paginatorMorosos;
    } else {
      console.error("Paginator Morosos no se ha encontrado.");
    }
  }

  private setupTableMorosos2() {
    if (this.paginatorMorosos2) {
      this.dataSourceMorosos2.paginator = this.paginatorMorosos2;
    } else {
      console.error("Paginator Morosos2 no se ha encontrado.");
    }
  }
}
