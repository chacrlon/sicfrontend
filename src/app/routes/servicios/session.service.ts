import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private codUsuarioSubject = new BehaviorSubject<string | null>(null);
  codUsuario$ = this.codUsuarioSubject.asObservable();

  constructor() {
    // Al cargar el servicio, inicializa codUsuarioSubject con el valor de localStorage
    const storedCodUsuario = localStorage.getItem('codUsuario');
    if (storedCodUsuario) {
      this.codUsuarioSubject.next(storedCodUsuario); // Comunica el valor almacenado
    }
  }

  setCodUsuario(codUsuario: string) {
    this.codUsuarioSubject.next(codUsuario);
    localStorage.setItem('codUsuario', codUsuario); // Guarda en localStorage
  }

  clearCodUsuario() {
    this.codUsuarioSubject.next(null);
    localStorage.removeItem('codUsuario'); // Elimina del localStorage
  }
}
