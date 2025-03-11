import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivosService } from './activos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrls: ['./activos.component.scss']
})
export class ActivosComponent implements OnInit {
  morosoData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private activosService: ActivosService) { }

  ngOnInit(): void {
    //this.getCredits();
  }

  getCredits() {
    this.activosService.getActivos().subscribe((data) => {
      var dataMoroso: any = data;
      this.dataSource.data = dataMoroso.data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  searchMoroso(consulta: string) {
    this.activosService.getCreditByIdCustomerOrAccountNumber(consulta).subscribe((data) => {
      var dataMoroso: any = data;
      this.dataSource.data = dataMoroso.data;
    });
  }

}


