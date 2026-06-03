import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CobranzaDetalleComponent } from '../cobranza-detalle/cobranza-detalle.component';

export interface ResumenCobranza {
  fechaCobranza: string;
  totalLotes: number;
  montoTotalRecuperado: number;
}

@Component({
  selector: 'app-cobranza-resumen',
  templateUrl: './cobranza-resumen.component.html',
  styleUrls: ['./cobranza-resumen.component.scss']
})
export class CobranzaResumenComponent implements OnInit, AfterViewInit {
  // Filtros de fecha (últimos 30 días por defecto)
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();

  displayedColumns: string[] = ['fechaCobranza', 'totalLotes', 'montoTotalRecuperado'];
  dataSource = new MatTableDataSource<ResumenCobranza>([]);
  totalMontoPeriodo: number = 0;
  totalLotesPeriodo: number = 0;
  filtrosAplicados: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  constructor(
    private administradorService: AdministradorService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CobranzaResumenComponent>
  ) {
    this.fechaFin = new Date();
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);
  }

  ngOnInit(): void {
    this.cargarResumen();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarResumen(): void {
    this.spinner.show();
    const params = {
      fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
      fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
    };
    this.administradorService.obtenerResumenCobranzas(params).subscribe({
      next: (response) => {
        if (response.code === 1000 || response.status === 200) {
          const datosProcesados = (response.data || []).map((item: any) => ({
            fechaCobranza: item.fechaCobranza || item.FECHA_COBRANZA || '',
            totalLotes: item.totalLotes || item.TOTAL_LOTES || 0,
            montoTotalRecuperado: item.montoTotalRecuperado || item.MONTO_TOTAL_RECUPERADO || 0
          }));
          this.dataSource.data = datosProcesados;
          this.calcularTotales();
          this.filtrosAplicados = true;
        } else {
          this.toast.warning(response.message || 'No hay datos en el período', '', this.override);
        }
        this.spinner.hide();
      },
      error: () => {
        this.toast.error('Error al cargar resumen', '', this.override);
        this.spinner.hide();
      }
    });
  }

  calcularTotales(): void {
    this.totalMontoPeriodo = this.dataSource.data.reduce((sum, item) => sum + (item.montoTotalRecuperado || 0), 0);
    this.totalLotesPeriodo = this.dataSource.data.reduce((sum, item) => sum + (item.totalLotes || 0), 0);
  }

  aplicarFiltros(): void {
    this.cargarResumen();
  }

  limpiarFiltros(): void {
    this.fechaFin = new Date();
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);
    this.cargarResumen();
  }

  // Exportar solo el resumen (igual que el botón de descarga)
  exportarResumen(): void {
    if (!this.dataSource.data.length) {
      this.toast.warning('No hay datos para exportar', '', this.override);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen Cobranzas');
    worksheet.addRow(['RESUMEN DE COBRANZAS']);
    worksheet.mergeCells('A1:C1');
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.addRow([]);
    worksheet.addRow([`Período: ${this.getPeriodoTexto()}`]);
    worksheet.addRow([`Fecha de generación: ${this.getCurrentTime()}`]);
    worksheet.addRow([]);

    const headers = ['Fecha', 'Lotes', 'Monto Recuperado (Bs.)'];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    });

    this.dataSource.data.forEach(item => {
      worksheet.addRow([item.fechaCobranza, item.totalLotes, this.formatCurrency(item.montoTotalRecuperado)]);
    });

    worksheet.addRow([]);
    worksheet.addRow([`Total Lotes: ${this.totalLotesPeriodo}`]);
    worksheet.addRow([`Monto Total: ${this.formatCurrency(this.totalMontoPeriodo)}`]);
    worksheet.columns.forEach(col => col.width = 20);

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `ResumenCobranzas_${moment().format('YYYYMMDD')}.xlsx`);
    });
  }

  // Generar reporte completo (resumen + detalle), igual que en el original
  generarReporteCompleto(): void {
    this.spinner.show();
    const params = {
      fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
      fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
    };

    // Cargar detalle para el mismo período
    this.administradorService.obtenerCobranzasPorRangoFecha(params).subscribe({
      next: (responseDetalle) => {
        const detalleData = (responseDetalle.code === 1000 || responseDetalle.status === 200) ? (responseDetalle.data || []) : [];

        const workbook = new ExcelJS.Workbook();

        // ========== HOJA RESUMEN ==========
        const worksheetResumen = workbook.addWorksheet('Resumen por Día');
        worksheetResumen.addRow(['RESUMEN DE COBRANZAS']);
        worksheetResumen.mergeCells('A1:C1');
        worksheetResumen.getRow(1).font = { bold: true, size: 14 };
        worksheetResumen.addRow([]);
        worksheetResumen.addRow([`Período: ${this.getPeriodoTexto()}`]);
        worksheetResumen.addRow([`Fecha de generación: ${this.getCurrentTime()}`]);
        worksheetResumen.addRow([]);

        const headerResumen = ['Fecha', 'Lotes', 'Monto Recuperado (Bs.)'];
        const headerRowResumen = worksheetResumen.addRow(headerResumen);
        headerRowResumen.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        });

        this.dataSource.data.forEach(item => {
          worksheetResumen.addRow([item.fechaCobranza, item.totalLotes, this.formatCurrency(item.montoTotalRecuperado)]);
        });

        worksheetResumen.addRow([]);
        worksheetResumen.addRow([`Total Lotes: ${this.totalLotesPeriodo}`]);
        worksheetResumen.addRow([`Monto Total: ${this.formatCurrency(this.totalMontoPeriodo)}`]);
        worksheetResumen.columns.forEach(col => col.width = 20);

        // ========== HOJA DETALLE ==========
        const worksheetDetalle = workbook.addWorksheet('Detalle de Cobranzas');
        worksheetDetalle.addRow(['DETALLE DE COBRANZAS']);
        worksheetDetalle.mergeCells('A1:F1');
        worksheetDetalle.getRow(1).font = { bold: true, size: 14 };
        worksheetDetalle.addRow([]);
        worksheetDetalle.addRow([`Período: ${this.getPeriodoTexto()}`]);
        worksheetDetalle.addRow([`Fecha de generación: ${this.getCurrentTime()}`]);
        worksheetDetalle.addRow([]);

        const headerDetalle = ['Fecha/Hora', 'ID Lote', 'Monto (Bs.)', 'Unidad', 'Estado', 'Archivo'];
        const headerRowDetalle = worksheetDetalle.addRow(headerDetalle);
        headerRowDetalle.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        });

        detalleData.forEach((item: any) => {
          worksheetDetalle.addRow([
            this.formatDate(item.fechaHoraCobranza),
            item.idLoteGiom,
            this.formatCurrency(item.montoTotalRecuperado),
            item.unidad || '',
            item.estadoCobranza === 'A' ? 'ACTIVO' : 'HISTÓRICO',
            item.nombreArchivo || ''
          ]);
        });

        worksheetDetalle.columns.forEach(col => col.width = 25);

        // Descargar
        const nombreArchivo = `ReporteCobranzas_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
        workbook.xlsx.writeBuffer().then(buffer => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, nombreArchivo);
          this.toast.success('Reporte Excel generado correctamente', '', this.override);
          this.spinner.hide();
        });
      },
      error: (error) => {
        console.error('Error al cargar detalle para reporte:', error);
        this.toast.error('Error al generar el reporte completo', '', this.override);
        this.spinner.hide();
      }
    });
  }

  // Abrir el modal de detalle para una fecha específica (similar a la funcionalidad original)
  verDetalleFecha(row: ResumenCobranza): void {
    // Convertir la fecha al formato dd/MM/yyyy
    let fecha = row.fechaCobranza;
    try {
      const m = moment(fecha, ['DD/MM/YYYY', 'YYYY-MM-DD']);
      if (m.isValid()) {
        fecha = m.format('DD/MM/YYYY');
      }
    } catch (e) {
      console.warn('Error parseando fecha', e);
    }

    this.dialog.open(CobranzaDetalleComponent, {
      width: '70%',
      height: '80%',
      data: {
        fechaInicio: fecha,
        fechaFin: fecha,
        // No se pasa idLote, por lo que el detalle mostrará todas las cobranzas de esa fecha
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  // ========== FUNCIONES DE FORMATO ==========
  formatCurrency(value: any): string {
    if (value == null || isNaN(value)) return 'Bs. 0,00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Bs. 0,00';
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES', minimumFractionDigits: 2 }).format(num);
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date') return '';
    try { return moment(dateString).format('DD/MM/YYYY HH:mm:ss'); } catch { return dateString; }
  }

  getDay(dateString: string): string {
    if (!dateString) return '--';
    try {
      const m = moment(dateString, ['DD/MM/YYYY', 'YYYY-MM-DD']);
      return m.isValid() ? m.format('DD') : '--';
    } catch { return '--'; }
  }

  getMonthYear(dateString: string): string {
    if (!dateString) return '---';
    try {
      const m = moment(dateString, ['DD/MM/YYYY', 'YYYY-MM-DD']);
      return m.isValid() ? m.format('MMM YYYY').toUpperCase() : '---';
    } catch { return '---'; }
  }

  getPeriodoTexto(): string {
    return `${moment(this.fechaInicio).format('DD/MM/YYYY')} - ${moment(this.fechaFin).format('DD/MM/YYYY')}`;
  }

  getCurrentTime(): string {
    return moment().format('DD/MM/YYYY HH:mm');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
