import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CobradoresServices } from '../cobradores/cobradores.services';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';
import { AddConfiguracionComponent } from '../add-configuracion/add-configuracion.component';
import { ConfiguracionDetailsComponent } from '../configuracion-details/configuracion-details.component';

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.scss']
})
export class ConfiguracionListComponent implements OnInit, OnChanges {
  @Input() descValor: string = 'codigo_operacion'; // 'codigo_operacion' o 'rif_piloto'

  displayedColumns: string[] = ['valor'];
  dataSource = new MatTableDataSource<Configuracion>();
  totalElements = 0;
  pageSize = 10;
  currentPage = 0; // 0-indexed para MatPaginator
  moduloBusqueda: string = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cobradoresServices: CobradoresServices,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['descValor'] && !changes['descValor'].firstChange) {
      this.currentPage = 0;
      this.moduloBusqueda = '';
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    const pageBackend = this.currentPage + 1; // backend empieza en 1
    this.cobradoresServices.buscarConfiguracionesPaginadas(
      this.descValor,
      this.moduloBusqueda,
      pageBackend,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.totalElements = response.totalElements;
        this.dataSource.data = response.content;
        if (this.paginator) {
          this.paginator.length = response.totalElements;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  buscarPorModulo(): void {
    this.currentPage = 0;
    this.loadData();
  }

  limpiarBusqueda(): void {
    this.moduloBusqueda = '';
    this.buscarPorModulo();
  }

  openAddConfiguracionModal(): void {
    const dialogRef = this.dialog.open(AddConfiguracionComponent, {
      width: '600px',
      data: { descValor: this.descValor }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadData();
      }
    });
  }

  onRowClicked(configuracion: Configuracion): void {
    const dialogRef = this.dialog.open(ConfiguracionDetailsComponent, {
      width: '600px',
      data: { id: configuracion.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated' || result === 'deleted') {
        this.loadData();
      }
    });
  }
}
