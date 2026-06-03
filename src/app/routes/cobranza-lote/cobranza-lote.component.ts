// cobranza-lote.component.ts (versión corregida)
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AdministradorService } from 'app/servicios/administrador/administrador.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface CobranzaLote {
  idCobranza: number;
  idLoteGiom: number;
  fechaHoraCobranza: string;
  montoTotalRecuperado: number;
  estadoCobranza: string;
  nombreArchivo: string;
  fechaCreacionLote: string;
  unidad: string;
}

export interface ResumenCobranza {
  fechaCobranza: string;
  totalLotes: number;
  montoTotalRecuperado: number;
}

@Component({
  selector: 'app-cobranza-lote',
  templateUrl: './cobranza-lote.component.html',
  styleUrls: ['./cobranza-lote.component.scss']
})
export class CobranzaLoteComponent implements OnInit, AfterViewInit {
  // Tabla de resumen
  displayedColumnsCobranzas: string[] = ['fechaCobranza', 'totalLotes', 'montoTotalRecuperado'];
  dataSourceCobranzas: MatTableDataSource<ResumenCobranza>;

  // Tabla de detalle
  displayedColumnsDetalle: string[] = ['fechaHoraCobranza', 'idLoteGiom', 'montoTotalRecuperado', 'unidad', 'estadoCobranza'];
  dataSourceDetalle: MatTableDataSource<CobranzaLote>;

  // Variables de estado
  loteSeleccionado: any = null;
  totalRecuperadoLote: number = 0;
  totalMontoPeriodo: number = 0;
  totalLotesPeriodo: number = 0;
  filtrosAplicados: boolean = false;
  filaSeleccionada: ResumenCobranza | null = null;
  modoResumen: boolean = false;
  // Filtros
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();

  // Referencias a componentes
  @ViewChild('paginatorCobranzas') paginatorCobranzas!: MatPaginator;
  @ViewChild('paginatorDetalle') paginatorDetalle!: MatPaginator;
  @ViewChild('sortCobranzas') sortCobranzas!: MatSort;
  @ViewChild('sortDetalle') sortDetalle!: MatSort;

  // Configuración de notificaciones
  override = {
    positionClass: 'toast-bottom-full-width',
    showDuration: 3000,
    timeOut: 5000,
    extendedTimeOut: 2000,
    closeButton: true,
    enableHtml: true,
  };

  constructor(
    public dialogRef: MatDialogRef<CobranzaLoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private administradorService: AdministradorService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.dataSourceCobranzas = new MatTableDataSource<ResumenCobranza>([]);
    this.dataSourceDetalle = new MatTableDataSource<CobranzaLote>([]);

    // Configuración inicial
    if (data?.idlote) {
      this.loteSeleccionado = data;
    }

    // Configurar fechas por defecto (últimos 30 días como en la versión original)
    this.fechaFin = new Date();
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);

    // 🔹 Determinar modo de visualización
  this.modoResumen = data?.modoResumen === true;

  // Si es modo resumen, ignoramos cualquier lote seleccionado
  if (this.modoResumen) {
    this.loteSeleccionado = null;
  } else if (data?.idlote) {
    this.loteSeleccionado = data;
  }

  }

  ngOnInit(): void {
  if (this.modoResumen) {
    this.cargarResumen();      // solo cargar resumen
  } else {
    this.cargarDatosIniciales(); // comportamiento original (resumen + detalle si hay lote)
  }
}

// Nuevo método exclusivo para cargar resumen (sin detalle)
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
        this.dataSourceCobranzas.data = datosProcesados;
        this.calcularTotalesPeriodo();
        this.filtrosAplicados = true;
      }
      this.spinner.hide();
    },
    error: () => this.spinner.hide()
  });
}

  ngAfterViewInit() {
    this.configurarTablas();
  }

  // Método para exportar resumen
exportarResumen(): void {
  if (!this.dataSourceCobranzas.data.length) {
    this.toast.warning('No hay datos para exportar', '', this.override);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Resumen Cobranzas');

  // Título
  worksheet.addRow(['RESUMEN DE COBRANZAS']);
  worksheet.mergeCells('A1:C1');
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.addRow([]);

  // Encabezados
  const headers = ['Fecha', 'Lotes', 'Monto Recuperado (Bs.)'];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });

  // Datos
  this.dataSourceCobranzas.data.forEach(item => {
    worksheet.addRow([
      item.fechaCobranza,
      item.totalLotes,
      this.formatCurrency(item.montoTotalRecuperado)
    ]);
  });

  // Pie
  worksheet.addRow([]);
  worksheet.addRow([`Total Lotes: ${this.totalLotesPeriodo}`]);
  worksheet.addRow([`Monto Total: ${this.formatCurrency(this.totalMontoPeriodo)}`]);

  // Ajustar columnas
  worksheet.columns.forEach(col => { col.width = 20; });

  // Descargar
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `ResumenCobranzas_${moment().format('YYYYMMDD')}.xlsx`);
  });
}

exportarDetalle(): void {
  if (!this.dataSourceDetalle.data.length) {
    this.toast.warning('No hay detalle para exportar', '', this.override);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Detalle Cobranzas');

  worksheet.addRow(['DETALLE DE COBRANZAS']);
  worksheet.mergeCells('A1:F1');
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.addRow([]);

  const headers = ['Fecha/Hora', 'ID Lote', 'Monto (Bs.)', 'Unidad', 'Estado', 'Archivo'];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });

  this.dataSourceDetalle.data.forEach(item => {
    worksheet.addRow([
      this.formatDate(item.fechaHoraCobranza),
      item.idLoteGiom,
      this.formatCurrency(item.montoTotalRecuperado),
      item.unidad,
      item.estadoCobranza === 'A' ? 'ACTIVO' : 'HISTÓRICO',
      item.nombreArchivo
    ]);
  });

  worksheet.columns.forEach(col => { col.width = 25; });
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `DetalleCobranzas_${moment().format('YYYYMMDD')}.xlsx`);
  });
}

  // Método para cargar datos iniciales - VERSIÓN SIMPLIFICADA Y CORREGIDA
  cargarDatosIniciales(): void {
    this.spinner.show();

    // Usar el mismo formato que en la versión original
    const params = {
      fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
      fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
    };

    console.log('Parámetros enviados:', params);

    // Cargar resumen
    this.administradorService.obtenerResumenCobranzas(params).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response);

        if (response.code === 1000 || response.status === 200) {
          // Usar el mismo procesamiento simple que en la versión original
          const datosProcesados = (response.data || []).map((item: any) => ({
            fechaCobranza: item.fechaCobranza || item.FECHA_COBRANZA || '',
            totalLotes: item.totalLotes || item.TOTAL_LOTES || 0,
            montoTotalRecuperado: item.montoTotalRecuperado || item.MONTO_TOTAL_RECUPERADO || 0
          }));

          console.log('Datos procesados:', datosProcesados);

          this.dataSourceCobranzas.data = datosProcesados;
          this.calcularTotalesPeriodo();
          this.filtrosAplicados = true;
          this.toast.success('Resumen de cobranzas cargado correctamente', '', this.override);
        } else {
          this.toast.error('No se pudo cargar el resumen de cobranzas', '', this.override);
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.toast.error('Error en la conexión: ' + error.message, '', this.override);
        this.spinner.hide();
      }
    });

    // Si hay lote seleccionado, cargar su detalle
    if (this.loteSeleccionado?.idlote) {
      this.cargarDetalleLote();
    }
  }

  // Configurar tablas con paginadores y ordenamiento
  configurarTablas(): void {
    if (this.dataSourceCobranzas && this.paginatorCobranzas) {
      this.dataSourceCobranzas.paginator = this.paginatorCobranzas;
    }
    if (this.dataSourceCobranzas && this.sortCobranzas) {
      this.dataSourceCobranzas.sort = this.sortCobranzas;
    }
    if (this.dataSourceDetalle && this.paginatorDetalle) {
      this.dataSourceDetalle.paginator = this.paginatorDetalle;
    }
    if (this.dataSourceDetalle && this.sortDetalle) {
      this.dataSourceDetalle.sort = this.sortDetalle;
    }
  }

  // Cargar detalle de un lote específico - VERSIÓN SIMPLIFICADA
  cargarDetalleLote(): void {
    if (!this.loteSeleccionado?.idlote) return;

    this.spinner.show();

    // Usar el mismo formato que en la versión original
    const params = {
      fechaInicio: '01/01/2000',
      fechaFin: moment().format('DD/MM/YYYY')
    };

    this.administradorService.obtenerCobranzasPorRangoFecha(params).subscribe({
      next: (response: any) => {
        if (response.code === 1000 || response.status === 200) {
          const todasCobranzas = response.data || [];
          const cobranzasDelLote = todasCobranzas.filter(
            (cobranza: any) => cobranza.idLoteGiom == this.loteSeleccionado.idlote
          );

          this.dataSourceDetalle.data = cobranzasDelLote;
          this.calcularTotalRecuperado();
          this.toast.success(`Cobranzas del lote ${this.loteSeleccionado.idlote} cargadas`, '', this.override);
        } else {
          this.toast.error('No se encontraron cobranzas para este lote', '', this.override);
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.toast.error('Error en la conexión', '', this.override);
        this.spinner.hide();
      }
    });
  }

  // Aplicar filtros de fecha - VERSIÓN SIMPLIFICADA
  aplicarFiltros(): void {
    this.spinner.show();

    const params = {
      fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
      fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
    };

    console.log('Aplicando filtros:', params);

    // Cargar resumen con nuevos filtros
    this.administradorService.obtenerResumenCobranzas(params).subscribe({
      next: (response: any) => {
        if (response.code === 1000 || response.status === 200) {
          // Procesamiento simple
          const datosProcesados = (response.data || []).map((item: any) => ({
            fechaCobranza: item.fechaCobranza || item.FECHA_COBRANZA || '',
            totalLotes: item.totalLotes || item.TOTAL_LOTES || 0,
            montoTotalRecuperado: item.montoTotalRecuperado || item.MONTO_TOTAL_RECUPERADO || 0
          }));

          this.dataSourceCobranzas.data = datosProcesados;
          this.calcularTotalesPeriodo();
          this.filtrosAplicados = true;
          this.toast.success('Filtros aplicados correctamente', '', this.override);
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al aplicar filtros:', error);
        this.toast.error('Error al aplicar filtros', '', this.override);
        this.spinner.hide();
      }
    });
  }

  // Limpiar filtros
  limpiarFiltros(): void {
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);
    this.fechaFin = new Date();
    this.filtrosAplicados = false;
    this.cargarDatosIniciales();
  }

  // Calcular totales del período
  calcularTotalesPeriodo(): void {
    this.totalMontoPeriodo = this.dataSourceCobranzas.data.reduce(
      (total, item) => total + (item.montoTotalRecuperado || 0), 0
    );

    this.totalLotesPeriodo = this.dataSourceCobranzas.data.reduce(
      (total, item) => total + (item.totalLotes || 0), 0
    );
  }

  // Calcular total recuperado del lote
  calcularTotalRecuperado(): void {
    this.totalRecuperadoLote = this.dataSourceDetalle.data.reduce(
      (total, cobranza) => {
        const monto = cobranza.montoTotalRecuperado || 0;
        return total + (typeof monto === 'number' ? monto : parseFloat(monto) || 0);
      },
      0
    );
  }

  // ========== FUNCIONES DE FORMATO MEJORADAS ==========

  // Formatear moneda - MANTENER IGUAL
  formatCurrency(value: any): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'Bs. 0,00';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return 'Bs. 0,00';
    }

    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }

  // Formatear fecha - VERSIÓN SIMPLIFICADA (como en la original)
  formatDate(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'DATA INVÁLIDA') {
      return '';
    }

    // Si ya está en formato dd/MM/yyyy, devolverlo así
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dateString;
    }

    try {
      // Intentar parsear con moment
      return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return dateString;
    }
  }

  // Nuevas funciones simplificadas para el diseño nuevo
  getDay(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'DATA INVÁLIDA') {
      return '--';
    }

    try {
      // Intentar diferentes formatos
      const m = moment(dateString, ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']);
      if (m.isValid()) {
        return m.format('DD');
      }

      // Si no se puede parsear, intentar extraer manualmente
      const match = dateString.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
      if (match && match[1]) {
        return match[1];
      }

      return '--';
    } catch (error) {
      return '--';
    }
  }

  getMonthYear(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'DATA INVÁLIDA') {
      return '---';
    }

    try {
      const m = moment(dateString, ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']);
      if (m.isValid()) {
        return m.format('MMM YYYY').toUpperCase();
      }

      // Si no se puede parsear, intentar mostrar el string original
      return dateString.length > 10 ? dateString.substring(0, 10) : dateString;
    } catch (error) {
      return '---';
    }
  }

  formatDateShort(dateString: string): string {
    return this.formatDate(dateString).split(' ')[0] || '';
  }

  getTime(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'DATA INVÁLIDA') {
      return '--:--';
    }

    try {
      const formatted = this.formatDate(dateString);
      const parts = formatted.split(' ');
      return parts.length > 1 ? parts[1] : '--:--';
    } catch (error) {
      return '--:--';
    }
  }

  // Obtener texto del período
  getPeriodoTexto(): string {
    return `${moment(this.fechaInicio).format('DD/MM/YYYY')} - ${moment(this.fechaFin).format('DD/MM/YYYY')}`;
  }

  // Obtener hora actual
  getCurrentTime(): string {
    return moment().format('DD/MM/YYYY HH:mm');
  }

  // Obtener lotes únicos en el detalle
  getLotesUnicos(): number {
    const lotes = this.dataSourceDetalle.data.map(item => item.idLoteGiom);
    return new Set(lotes).size;
  }

  // Cambiar de tab
  cambiarTab(event: MatTabChangeEvent): void {
    if (event.index === 1 && this.dataSourceDetalle.data.length === 0 && !this.loteSeleccionado) {
      this.cargarDetalleGeneral();
    }
  }

  // Cargar detalle general (sin lote específico)
  cargarDetalleGeneral(): void {
    this.spinner.show();

    const params = {
      fechaInicio: moment(this.fechaInicio).format('DD/MM/YYYY'),
      fechaFin: moment(this.fechaFin).format('DD/MM/YYYY')
    };

    this.administradorService.obtenerCobranzasPorRangoFecha(params).subscribe({
      next: (response: any) => {
        if (response.code === 1000 || response.status === 200) {
          this.dataSourceDetalle.data = response.data || [];
          this.calcularTotalRecuperado();
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.spinner.hide();
      }
    });
  }

  // Seleccionar fila
  seleccionarFila(row: ResumenCobranza): void {
    this.filaSeleccionada = row;
  }

  // Ver detalle de una fecha específica
  verDetalleFecha(row: ResumenCobranza): void {
    // Filtrar detalle por fecha específica
    this.cargarDetallePorFecha(row.fechaCobranza);
  }

  cargarDetallePorFecha(fecha: string): void {
    this.spinner.show();

    // Convertir fecha al formato del backend si es necesario
    let fechaFormateada = fecha;
    try {
      const m = moment(fecha, ['DD/MM/YYYY', 'YYYY-MM-DD']);
      if (m.isValid()) {
        fechaFormateada = m.format('DD/MM/YYYY');
      }
    } catch (error) {
      console.warn('Error formateando fecha para filtro:', error);
    }

    const params = {
      fechaInicio: fechaFormateada,
      fechaFin: fechaFormateada
    };

    this.administradorService.obtenerCobranzasPorRangoFecha(params).subscribe({
      next: (response: any) => {
        if (response.code === 1000 || response.status === 200) {
          // Cambiar a pestaña de detalle
          setTimeout(() => {
            const tabs = document.querySelector('mat-tab-group') as any;
            if (tabs) {
              tabs.selectedIndex = 1;
            }
          }, 100);

          this.dataSourceDetalle.data = response.data || [];
          this.calcularTotalRecuperado();
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar detalle por fecha:', error);
        this.spinner.hide();
      }
    });
  }

  // Generar informe diario
  generarInformeDiario(row: ResumenCobranza): void {
    console.log('Generar informe para:', row.fechaCobranza);
    this.toast.success(`Generando informe para ${row.fechaCobranza}`, '', this.override);
  }

  // Generar reporte completo
  generarReporteCompleto(): void {
  if (!this.dataSourceCobranzas.data.length && !this.dataSourceDetalle.data.length) {
    this.toast.warning('No hay datos para generar el reporte', '', this.override);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheetResumen = workbook.addWorksheet('Resumen por Día');
  const worksheetDetalle = workbook.addWorksheet('Detalle de Cobranzas');

  // ========== HOJA RESUMEN ==========
  // Título
  worksheetResumen.addRow(['REPORTE DE COBRANZAS']);
  worksheetResumen.mergeCells('A1:C1');
  worksheetResumen.getRow(1).font = { bold: true, size: 14 };
  worksheetResumen.addRow([]);
  worksheetResumen.addRow([`Período: ${this.getPeriodoTexto()}`]);
  worksheetResumen.addRow([`Fecha de generación: ${this.getCurrentTime()}`]);
  worksheetResumen.addRow([]);

  // Encabezados resumen
  const headerResumen = ['Fecha', 'Lotes', 'Monto Recuperado (Bs.)'];
  const headerRowResumen = worksheetResumen.addRow(headerResumen);
  headerRowResumen.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });

  // Datos resumen
  this.dataSourceCobranzas.data.forEach(item => {
    const row = worksheetResumen.addRow([
      item.fechaCobranza,
      item.totalLotes,
      this.formatCurrency(item.montoTotalRecuperado)
    ]);
    row.getCell(3).numFmt = '#,##0.00';
  });

  // Pie resumen
  worksheetResumen.addRow([]);
  worksheetResumen.addRow([`Total Lotes: ${this.totalLotesPeriodo}`]);
  worksheetResumen.addRow([`Monto Total: ${this.formatCurrency(this.totalMontoPeriodo)}`]);

  // Ajustar columnas resumen
  worksheetResumen.columns.forEach(col => { col.width = 25; });

  // ========== HOJA DETALLE ==========
  // Título detalle
  worksheetDetalle.addRow(['DETALLE DE COBRANZAS']);
  worksheetDetalle.mergeCells('A1:F1');
  worksheetDetalle.getRow(1).font = { bold: true, size: 14 };
  worksheetDetalle.addRow([]);
  worksheetDetalle.addRow([`Período: ${this.getPeriodoTexto()}`]);
  worksheetDetalle.addRow([`Fecha de generación: ${this.getCurrentTime()}`]);
  worksheetDetalle.addRow([]);

  // Encabezados detalle
  const headerDetalle = ['Fecha/Hora', 'ID Lote', 'Monto (Bs.)', 'Unidad', 'Estado', 'Archivo'];
  const headerRowDetalle = worksheetDetalle.addRow(headerDetalle);
  headerRowDetalle.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4A96D2' } };
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
  });

  // Datos detalle (usar el dataSource actual, que ya tiene los datos filtrados)
  this.dataSourceDetalle.data.forEach(item => {
    worksheetDetalle.addRow([
      this.formatDate(item.fechaHoraCobranza),
      item.idLoteGiom,
      this.formatCurrency(item.montoTotalRecuperado),
      item.unidad || '',
      item.estadoCobranza === 'A' ? 'ACTIVO' : 'HISTÓRICO',
      item.nombreArchivo || ''
    ]);
  });

  // Ajustar columnas detalle
  worksheetDetalle.columns.forEach(col => { col.width = 25; });

  // ========== GENERAR Y DESCARGAR ==========
  const nombreArchivo = `ReporteCobranzas_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, nombreArchivo);
  });

  this.toast.success('Reporte Excel generado correctamente', '', this.override);
}

verMasInformacion(row: CobranzaLote): void {
  const info = `
    ID Cobranza: ${row.idCobranza}
    Fecha/Hora: ${this.formatDate(row.fechaHoraCobranza)}
    Lote: ${row.idLoteGiom}
    Monto: ${this.formatCurrency(row.montoTotalRecuperado)}
    Unidad: ${row.unidad || 'No especificada'}
    Estado: ${row.estadoCobranza === 'A' ? 'Activo' : 'Histórico'}
    Archivo: ${row.nombreArchivo}
    Fecha creación lote: ${this.formatDate(row.fechaCreacionLote)}
  `;
  alert(info); // O usa MatDialog para mayor elegancia
}

  // Aplicar filtro a tabla
  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  // Regresar
  regresar(): void {
    this.dialogRef.close();
  }
}
