
import { Component, OnInit } from '@angular/core';
import { CobradoresServices } from './cobradores.services';
import { MatDialog } from '@angular/material/dialog';
import { ModalCobradoresComponentComponent } from './modal-cobradores-component/modal-cobradores-component.component';
import { ModalInsertarCobradorComponent } from './modal-insertar-cobrador/modal-insertar-cobrador.component';
import { SessionService } from '../servicios/session.service';
import { Auditoria } from './auditoria.model';

@Component({
  selector: 'app-cobradores',
  templateUrl: './cobradores.component.html',
  styleUrls: ['./cobradores.component.scss']
})
export class CobradoresComponent implements OnInit {
  cobradoresData: any[] = [];
  cobradorSeleccionado: any = {};
  codUsuario: string | null = null;
  isLoading: boolean = false;
  tipoConfigSeleccionado: string = 'codigo_operacion';
  mostrarRifPiloto = false;  // ← cambia a true cuando se quiera visualizar


  constructor(private cobradoresServices: CobradoresServices, private dialog: MatDialog, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.getCobradores();
    this.sessionService.codUsuario$.subscribe(cod => {
      this.codUsuario = cod; // Asigna el valor del código de usuario
    });

  }

openModal(cobrador: any): void {
    console.log('=== Abriendo modal para cobrador ===');
    console.log('Cobrador seleccionado:', cobrador);

    const dialogRef = this.dialog.open(ModalCobradoresComponentComponent, {
        width: '500px',
        data: { ...cobrador }
    });

    console.log('Modal abierto, esperando resultado...');

    dialogRef.afterClosed().subscribe(
        result => {
            console.log('Modal cerrado con resultado:', result);

            if (result && result.delete) {
                console.log('Eliminar cobrador con ID:', result.collector_id);
                this.deleteCobrador(result.collector_id);
            } else if (result) {
                console.log('Actualizar cobrador:', result);
                console.log('ID Original de la fila:', cobrador.collector_id);
                this.updateCobrador(cobrador.collector_id, result);
            } else {
                console.log('Modal cerrado sin resultado (cancelado)');
            }
        },
        error => {
            console.error('Error al cerrar el modal:', error);
        }
    );
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
    console.log('=== COMPONENTE: updateCobrador ===');

    const idOriginal = collector_id;
    console.log('1. ID Original:', idOriginal);
    console.log('2. Datos del modal:', updatedCobradorData);

    const originalCobrador = this.cobradoresData.find(c => c.collector_id === idOriginal);
    console.log('3. Cobrador encontrado?:', originalCobrador);

    if (!originalCobrador) {
        console.error('ERROR: Cobrador no encontrado');
        return;
    }

    console.log('4. Llamando al servicio...');

    this.cobradoresServices.updateCobrador(idOriginal, updatedCobradorData).subscribe(
        response => {
            console.log('5. Respuesta del servidor recibida:', response);

            if (response.code === 1000) {
                console.log('6. Éxito! Actualizando vista...');
                this.getCobradores(); // Refrescar
            } else {
                console.log('7. Error del servidor:', response);
                alert(`Error: ${response.message}`);
            }
        },
        error => {
            console.error('8. Error HTTP:', error);
            alert('Error de conexión con el servidor');
        }
    );
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
