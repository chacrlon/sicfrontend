
import { Component, OnInit } from '@angular/core';
import { CobradoresServices } from './cobradores.services';
import { MatDialog } from '@angular/material/dialog';
import { ModalCobradoresComponentComponent } from './modal-cobradores-component/modal-cobradores-component.component';
import { ModalInsertarCobradorComponent } from './modal-insertar-cobrador/modal-insertar-cobrador.component';
import { SessionService } from '../servicios/session.service';
import { Auditoria } from './auditoria.model'; // Importar el modelo de auditoría

@Component({
  selector: 'app-cobradores',
  templateUrl: './cobradores.component.html',
  styleUrls: ['./cobradores.component.scss']
})
export class CobradoresComponent implements OnInit {
  cobradoresData: any[] = [];
  cobradorSeleccionado: any = {};
  codUsuario: string | null = null; // Almacena el código de usuario
  isLoading: boolean = false;

  constructor(private cobradoresServices: CobradoresServices, private dialog: MatDialog, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.getCobradores();
    this.sessionService.codUsuario$.subscribe(cod => {
      this.codUsuario = cod; // Asigna el valor del código de usuario
    });

  }

  openModal(cobrador: any): void {
    const dialogRef = this.dialog.open(ModalCobradoresComponentComponent, { width: '500px', data: { ...cobrador } });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.delete) {
        this.deleteCobrador(result.collector_id);
      } else if(result) {
        this.updateCobrador(result.collector_id, result);
      }
    });
  }

  getCobradores() {
    this.isLoading = true;
    this.cobradoresServices.getCobradoresData().subscribe((data) => {
        this.cobradoresData = data.data;
        this.isLoading = false;
    });
}

  insertCobrador(cobradorData: any) {
    this.cobradoresServices.insertCobrador(cobradorData).subscribe(response => {
        const collectorName = cobradorData.collector_name;
        this.registrarAuditoria(`Inserción de cobrador: ${collectorName}`, 'INSERT');
        this.getCobradores(); // Para refrescar la lista
    });
}

registrarAuditoria(descripcion: string, tipoAccion: string) {
  const usuario = this.codUsuario ?? ''; // Usar un string vacío si codUsuario es null
  const auditoria = new Auditoria(descripcion, tipoAccion, usuario);
  this.cobradoresServices.registrarAuditoria(auditoria).subscribe(response => {
  });
}

  openInsertModal(): void {
    const dialogRef = this.dialog.open(ModalInsertarCobradorComponent, {
      width: '500px',
      data: { codUsuario: this.codUsuario } // Pasa el codUsuario al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.insertCobrador(result);
      }
    });
  }

  updateCobrador(collector_id: number, updatedCobradorData: any) {
    // Lógica para buscar el cobrador original
    const originalCobrador = this.cobradoresData.find(c => c.collector_id === collector_id);
    if (!originalCobrador) {
        console.error('Cobrador original no encontrado para ID:', collector_id);
        return; // Salir si no se encontró el cobrador
    }

    let descripcionCambios = '';

    // Comparar propiedades y construir la descripción
    for (let key in updatedCobradorData) {
        if (updatedCobradorData.hasOwnProperty(key) && originalCobrador[key] !== updatedCobradorData[key]) {
            descripcionCambios += `${key}: ${originalCobrador[key]} -> ${updatedCobradorData[key]}, `;
        }
    }

    // Quitar la última coma y espacio
    descripcionCambios = descripcionCambios.slice(0, -2);

    // Ahora registra la auditoría usando el nombre del cobrador original
    this.cobradoresServices.updateCobrador(collector_id, updatedCobradorData).subscribe(response => {
        // Asegúrate de usar el nombre del cobrador original aquí
        this.registrarAuditoria(`Actualizaciones de cobrador: ${descripcionCambios} - al cobrador: ${originalCobrador.collector_name}`, 'UPDATE');
        this.getCobradores(); // Para refrescar la lista
    });
}

deleteCobrador(collector_id: number): void {
  // Buscar el cobrador original en la lista antes de eliminarlo
  const cobradorAEliminar = this.cobradoresData.find(c => c.collector_id === collector_id);

  // Verify that the cobrador exists to avoid errors
  if (cobradorAEliminar) {
    const datos = {}; // Cuerpo vacío o puedes definir los datos que quieras enviar
    this.cobradoresServices.deleteCobrador(collector_id, datos).subscribe(response => {
        // Registrar auditoría usando el nombre del cobrador
        this.registrarAuditoria(`Eliminación de cobrador: ${cobradorAEliminar.collector_name}`, 'DELETE');
        this.getCobradores(); // Para refrescar la lista
    });
  } else {
    console.error('Cobrador no encontrado para ID:', collector_id);
  }
}

}
