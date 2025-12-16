import { Component, OnInit } from '@angular/core';
import { Configuracion, ResponseModel } from '../../models/configuracion.model';
import { CobradoresServices } from '../cobradores/cobradores.services';
import { MatDialog } from '@angular/material/dialog';
import { AddConfiguracionComponent } from '../add-configuracion/add-configuracion.component';
import { ConfiguracionDetailsComponent } from '../configuracion-details/configuracion-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.scss']
})
export class ConfiguracionListComponent implements OnInit {
  dataSource = new MatTableDataSource<Configuracion>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Solo mostramos la columna de valor
  columnasAMostrar: string[] = ['valor'];

  configuraciones: Configuracion[] = [];
  currentConfiguracion?: Configuracion;
  currentIndex = -1;
  modulo = '';
  isLoading = false;

  constructor(
    private cobradoresServices: CobradoresServices,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveConfiguraciones();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Método para abrir edición al hacer clic en la fila
  onRowClicked(configuracion: Configuracion) {
    this.openEditConfiguracionModal(configuracion.id!);
  }

  openAddConfiguracionModal(): void {
    const dialogRef = this.dialog.open(AddConfiguracionComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.refreshList();
      }
    });
  }

  openEditConfiguracionModal(id: number): void {
    const dialogRef = this.dialog.open(ConfiguracionDetailsComponent, {
      width: '600px',
      data: { id: id }
    });

    // Suscribirse al evento onDelete del modal
    dialogRef.componentInstance.onDelete.subscribe((deletedId: number) => {
      this.configuraciones = this.configuraciones.filter(config => config.id !== deletedId);
      this.dataSource.data = this.configuraciones;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated' || result === 'deleted') {
        this.refreshList();
      }
    });
  }

  retrieveConfiguraciones(): void {
    this.isLoading = true;
    this.cobradoresServices.getAll()
      .subscribe({
        next: (res: ResponseModel) => {
          this.isLoading = false;
          if (res.code === 1000) {
            this.configuraciones = res.data;
            this.dataSource.data = this.configuraciones;
          } else {
            console.error('Error al cargar configuraciones:', res.message);
          }
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
        }
      });
  }

  refreshList(): void {
    this.retrieveConfiguraciones();
    this.currentConfiguracion = undefined;
    this.currentIndex = -1;
  }

  // Este método ya no es necesario si no tenemos botones individuales
  deleteConfiguracion(id: number): void {
    // Este método se puede eliminar o mantener para uso interno
  }
}
