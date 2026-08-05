import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface CobranzaLote {
  idCobranza: number;
  idLoteGiom: number;
  fechaHoraCobranza: string;
  montoTotalRecuperado: number;
  estadoCobranza: string;
  nombreArchivo: string;
  fechaCreacionLote: string;
  unidad: string;
  registrosCobrados: number;
}

@Component({
  selector: 'app-cobranza-detalle',
  templateUrl: './cobranza-detalle.component.html',
  styleUrls: ['./cobranza-detalle.component.scss']
})
export class CobranzaDetalleComponent implements OnInit, AfterViewInit {
  idLote?: number;
  nombreArchivoLote?: string;
  unidadLote?: string;

  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();

  displayedColumnsDetalle: string[] = [
  'fechaHoraCobranza',
  'idLoteGiom',
  'montoTotalRecuperado',
  'registrosCobrados',
  'unidad',
  'estadoCobranza'
];

  dataSource = new MatTableDataSource<CobranzaLote>([]);
  totalRecuperado: number = 0;

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
    public dialogRef: MatDialogRef<CobranzaDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fechaFin = new Date();
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);

    if (data) {
      this.idLote = data.idLote;
      this.nombreArchivoLote = data.nombreArchivo || 'Sin archivo';
      this.unidadLote = data.unidad || 'No asignada';
      console.log('📌 Detalle abierto para lote:', this.idLote);
    }
  }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarDetalle(): void {
    this.spinner.show();

    let params: any;
    if (this.idLote) {
      params = {
        fechaInicio: '01/01/2000',
        fechaFin: moment().format('DD/MM/YYYY')
      };
      console.log('🔍 Consultando cobranzas para lote', this.idLote, 'con fechas:', params);
    } else {
      if (!this.fechaInicio || !this.fechaFin) {
        this.toast.warning('Debe seleccionar ambas fechas', '', this.override);
        this.spinner.hide();
        return;
      }
      params = {
        fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
        fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
      };
    }

    this.administradorService.obtenerCobranzasPorRangoFecha(params).subscribe({
      next: (response: any) => {
        console.log('📡 Respuesta del backend:', response);
        if (response.code === 1000 || response.status === 200) {
          let allData = response.data || [];
          let filteredData = allData;
          if (this.idLote) {
            const targetId = Number(this.idLote);
            filteredData = allData.filter((item: any) => Number(item.idLoteGiom) === targetId);
            console.log(`✅ Cobranzas filtradas para lote ${targetId}: ${filteredData.length}`);
          }
          this.dataSource.data = filteredData;
          this.calcularTotalRecuperado();

          if (filteredData.length === 0) {
            const msg = this.idLote
              ? `No se encontraron cobranzas para el lote ${this.idLote}`
              : 'No hay cobranzas en el período seleccionado';
            this.toast.info(msg, '', this.override);
          }
        } else {
          this.toast.error(response.message || 'Error al cargar los datos', '', this.override);
          this.dataSource.data = [];
          this.totalRecuperado = 0;
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        this.toast.error('Error de conexión con el servidor', '', this.override);
        this.spinner.hide();
      }
    });
  }

  aplicarFiltros(): void {
    if (this.idLote) {
      this.toast.info('Para un lote específico se muestran todas las cobranzas sin filtro de fecha', '', this.override);
      return;
    }
    this.cargarDetalle();
  }

  limpiarFiltros(): void {
    if (this.idLote) {
      this.cargarDetalle();
    } else {
      this.fechaFin = new Date();
      this.fechaInicio = new Date();
      this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);
      this.cargarDetalle();
    }
  }

  calcularTotalRecuperado(): void {
    this.totalRecuperado = this.dataSource.data.reduce(
      (sum, item) => sum + (item.montoTotalRecuperado || 0), 0
    );
  }

  getLotesUnicos(): number {
    const lotes = this.dataSource.data.map(item => item.idLoteGiom);
    return new Set(lotes).size;
  }

  exportarDetalle(): void {
  if (!this.dataSource.data.length) {
    this.toast.warning('No hay datos para exportar', '', this.override);
    return;
  }

  console.log('📎 Exportando detalle a Excel...');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Detalle Cobranzas');

  // Título (ahora 7 columnas)
  worksheet.addRow(['DETALLE DE COBRANZAS']);
  worksheet.mergeCells('A1:G1');  // <-- Cambiado de F a G
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.addRow([]);
  worksheet.addRow([`Período consultado: ${this.getPeriodoTexto()}`]);
  worksheet.addRow([]);

  // Encabezados (incluye Registros Cobrados)
  const headers = ['Fecha/Hora', 'ID Lote', 'Monto (Bs.)', 'Registros Cobrados', 'Unidad', 'Estado', 'Archivo'];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });

  // Datos
  this.dataSource.data.forEach(item => {
    worksheet.addRow([
      this.formatDate(item.fechaHoraCobranza),
      item.idLoteGiom,
      this.formatCurrency(item.montoTotalRecuperado),
      item.registrosCobrados || 0,        // <-- NUEVA COLUMNA
      item.unidad || '',
      item.estadoCobranza === 'A' ? 'ACTIVO' : 'HISTÓRICO',
      item.nombreArchivo || ''
    ]);
  });

  // Ajustar ancho de columnas (opcional, pero recomendado)
  worksheet.columns.forEach(col => { col.width = 20; });

  // Generar y descargar archivo
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `DetalleCobranzas_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
    this.toast.success('Reporte exportado exitosamente', '', this.override);
  }).catch(error => {
    console.error('Error al generar el Excel:', error);
    this.toast.error('Error al generar el reporte', '', this.override);
  });
}

  generarReporteCompleto(): void {
    console.log('📄 Generando reporte completo...');
    this.exportarDetalle();
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  verMasInformacion(row: CobranzaLote): void {
    this.toast.info(`
      ID Cobranza: ${row.idCobranza}<br>
      Fecha/Hora: ${this.formatDate(row.fechaHoraCobranza)}<br>
      Lote: ${row.idLoteGiom}<br>
      Monto: ${this.formatCurrency(row.montoTotalRecuperado)}<br>
      Unidad: ${row.unidad || 'No especificada'}<br>
      Estado: ${row.estadoCobranza === 'A' ? 'Activo' : 'Histórico'}<br>
      Archivo: ${row.nombreArchivo}
    `, 'Detalles', this.override);
  }

  // ========== FUNCIONES DE FORMATO ==========
  formatCurrency(value: any): string {
    if (value == null || isNaN(value)) return 'Bs. 0,00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Bs. 0,00';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency', currency: 'VES', minimumFractionDigits: 2
    }).format(num);
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date') return '';
    try { return moment(dateString).format('DD/MM/YYYY HH:mm:ss'); } catch { return dateString; }
  }

  formatDateShort(dateString: string): string {
    return this.formatDate(dateString).split(' ')[0] || '';
  }

  getTime(dateString: string): string {
    if (!dateString) return '--:--';
    const parts = this.formatDate(dateString).split(' ');
    return parts.length > 1 ? parts[1] : '--:--';
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
