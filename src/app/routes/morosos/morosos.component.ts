import { Component, OnInit, ViewChild } from '@angular/core';
import { MorosoService } from './moroso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-morosos',
  templateUrl: './morosos.component.html',
  styleUrls: ['./morosos.component.scss']
})
export class MorososComponent implements OnInit {
  dataSourceMorosos: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceMorosos2: MatTableDataSource<any> = new MatTableDataSource<any>();
  showNotificaciones: boolean = false;
  isSearchEnabled: boolean = true; // Nueva variable de control

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
   // this.getMorososAll();
  }

  public getMorososAll(): void {
    this.loadingMorosos = true;
    this.showNotificaciones = false;
    this.isSearchEnabled = false; // Deshabilita la búsqueda al obtener morosos

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
            this.isSearchEnabled = true; // Habilita la búsqueda después de cargar datos
        }
    );
}

  searchMorosos() {
    if (!this.isSearchEnabled) {
      console.warn('La búsqueda está inhabilitada.');
      return; // Detiene la función si la búsqueda está deshabilitada
    }

    this.showNotificaciones = true;
    if (this.searchForm.invalid) {
      return;
    }

    const accountNumber = this.searchForm.value.accountNumber;
    this.loadingMorosos = true;

    this.morosoService.getByIdCustomerOrAccountNumber(accountNumber).subscribe(data => {
      if (data.status === 200) {
        this.dataSourceMorosos.data = data.data || [];
        this.setupTableMorosos();
      } else {
        console.error(data.message);
      }
    }, error => {
      console.error('Error al buscar morosos por número de cuenta', error);
    });

    this.morosoService.getByIdCustomerOrAccountNumber2(accountNumber).subscribe(data2 => {
      if (data2.status === 200) {
        this.dataSourceMorosos2.data = data2.data || [];
        this.setupTableMorosos2();
      } else {
        console.error(data2.message);
      }
    }, error => {
      console.error('Error al buscar morosos2 por número de cuenta', error);
    }, () => {
      this.loadingMorosos = false;
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
