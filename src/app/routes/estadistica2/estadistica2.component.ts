import { Component, OnInit, ViewChild } from '@angular/core';
import { Estadistica2Service } from './estadistica2.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-estadistica2',
  templateUrl: './estadistica2.component.html',
  styleUrls: ['./estadistica2.component.scss']
})
export class Estadistica2Component implements OnInit {
  displayedColumnsPIC: string[] = ['collectorName', 'totalOperations', 'operationMessage'];
  displayedColumnsPCP: string[] = ['collectorName', 'totalOperations', 'operationMessage'];

  dataSourcePIC = new MatTableDataSource<any>([]);
  dataSourcePCP = new MatTableDataSource<any>([]);

  totalTransactionsPIC: number = 0; // Propiedad para almacenar el total de transacciones de PIC
  totalTransactionsPCP: number = 0; // Propiedad para almacenar el total de transacciones de PCP

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private estadistica2Service: Estadistica2Service) {}

  ngOnInit(): void {
    // Inicializa los paginadores
    this.dataSourcePIC.paginator = this.paginator;
    this.dataSourcePCP.paginator = this.paginator; // Sincroniza el paginador con ambas tablas
  }

  searchEstadisticas(fecha: string) {
    // Obtener estadísticas de PIC
    this.estadistica2Service.getEstadisticasPorFechaPIC(fecha).subscribe((dataPIC: any) => {
      if (dataPIC && dataPIC.data) {
        this.dataSourcePIC.data = dataPIC.data;
        // Suponiendo que solo hay un registro en dataPIC.data
        this.totalTransactionsPIC = dataPIC.data[0]?.totalTransactions || 0; // Asigna el valor
      } else {
        this.dataSourcePIC.data = [];
        this.totalTransactionsPIC = 0; // Resetea el valor si no hay datos
      }
      this.dataSourcePIC.paginator = this.paginator; // Configura el paginador nuevamente
    }, error => {
      console.error('Error al buscar estadísticas PIC', error);
      this.dataSourcePIC.data = [];
      this.totalTransactionsPIC = 0; // Resetea el valor en caso de error
    });

    // Obtener estadísticas de PCP
    this.estadistica2Service.getEstadisticasPorFechaPCP(fecha).subscribe((dataPCP: any) => {
      if (dataPCP && dataPCP.data) {
        this.dataSourcePCP.data = dataPCP.data;
        // Suponiendo que solo hay un registro en dataPCP.data
        this.totalTransactionsPCP = dataPCP.data[0]?.totalTransactions || 0; // Asigna el valor
      } else {
        this.dataSourcePCP.data = [];
        this.totalTransactionsPCP = 0; // Resetea el valor si no hay datos
      }
      this.dataSourcePCP.paginator = this.paginator; // Configura el paginador nuevamente
    }, error => {
      console.error('Error al buscar estadísticas PCP', error);
      this.dataSourcePCP.data = [];
      this.totalTransactionsPCP = 0; // Resetea el valor en caso de error
    });
  }
}
