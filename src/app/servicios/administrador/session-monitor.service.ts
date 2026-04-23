// src/app/servicios/administrador/session-monitor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';   // ← Importa Observable
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class SessionMonitorService {
  private heartbeatInterval: any;
  private sessionTokenKey = 'uniqueSessionToken';
  private apiUrl = environment.sicApiUrl; // Asegúrate que sicApiUrl esté definida

  constructor(private http: HttpClient) {}

  private generateSessionToken(codUsuario: string): string {
    return btoa(`${codUsuario}-${Date.now()}-${Math.random()}`);
  }

  // ✅ Ahora retorna Observable para poder esperar la respuesta
  registerSession(codUsuario: string): Observable<any> {
    const sessionToken = this.generateSessionToken(codUsuario);
    localStorage.setItem(this.sessionTokenKey, sessionToken);
    const body = { codUsuario, sessionToken };
    const url = `${this.apiUrl}/api/registerSession`;
    console.log('Registrando sesión en:', url, 'con body:', body);
    return this.http.post(url, body);
  }

  startHeartbeat(): void {
  console.log('Heartbeat iniciado');
  if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  this.heartbeatInterval = setInterval(() => {
    console.log('Ejecutando heartbeat...');
    const sessionToken = localStorage.getItem(this.sessionTokenKey);
    if (!sessionToken) {
      console.warn('Heartbeat: No hay token, deteniendo');
      this.stopHeartbeat();
      return;
    }
    const url = `${this.apiUrl}/api/heartbeat`;
    const headers = { Authorization: `Bearer ${sessionToken}` };
    this.http.post(url, {}, { headers }).subscribe({
      next: () => console.log('Heartbeat OK'),
      error: (err) => {
        console.error('Heartbeat error:', err);
        if (err.status === 401) this.handleSessionExpired();
      }
    });
  }, 30000); // 30 segundos para pruebas (luego vuelve a 120000)
}

  stopHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    localStorage.removeItem(this.sessionTokenKey);
  }

  private handleSessionExpired(): void {
    sessionStorage.clear();
    localStorage.removeItem(this.sessionTokenKey);
    window.location.href = '/auth/login';
  }
}
