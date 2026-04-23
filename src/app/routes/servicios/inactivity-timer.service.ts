import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer, interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SessionTimeoutDialogComponentComponent } from '../session-timeout-dialog-component/session-timeout-dialog-component.component';
import { AuthService } from '@core/authentication';

@Injectable({ providedIn: 'root' })
export class InactivityTimerService implements OnDestroy {
  private readonly SESSION_TIMEOUT = 300000; // 5 minutos
  private lastActivityTime = Date.now();
  private timerSub!: Subscription;
  private countdownSub!: Subscription;
  private boundHandleActivity: () => void;
  private destroyed$ = false;

  constructor(private router: Router, private dialog: MatDialog, private auth: AuthService) {
    this.boundHandleActivity = this.handleUserActivity.bind(this);
  }

  startTimer() {
    this.setupActivityListeners();
    this.resetTimer();
  }

  stopTimer() {
    this.removeActivityListeners();
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
  }

  private setupActivityListeners() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, this.boundHandleActivity);
    });
  }

  private removeActivityListeners() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      document.removeEventListener(event, this.boundHandleActivity);
    });
  }

  private handleUserActivity() {
    const now = Date.now();
    // Solo actualizar si ha pasado más de 1 segundo desde la última actividad
    if (now - this.lastActivityTime > 1000) {
      this.lastActivityTime = now;
      this.resetTimer();
    }
  }

  private resetTimer() {
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();

    this.timerSub = timer(this.SESSION_TIMEOUT).subscribe(() => this.showTimeoutDialog());

    // Opcional: mostrar el tiempo restante cada 5 segundos (menos ruido)
    this.countdownSub = interval(5000).subscribe(() => {
      const remaining = Math.max(0, this.SESSION_TIMEOUT - (Date.now() - this.lastActivityTime));
      if (remaining <= 10000 && remaining > 0) {
        console.log(`Sesión expirará en ${Math.floor(remaining / 1000)} segundos`);
      }
    });
  }

  private showTimeoutDialog() {
    const dialogRef = this.dialog.open(SessionTimeoutDialogComponentComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'extend') {
        this.resetTimer();
      } else {
        this.logout();
      }
    });
  }

  private logout() {
    this.dialog.closeAll();
    this.auth.logout().subscribe({
      next: () => this.finalizeLogout(),
      error: () => this.finalizeLogout()
    });
  }

  private finalizeLogout() {
    this.stopTimer();
    this.router.navigateByUrl('/auth/login');
  }

  forceStop() {
    this.destroyed$ = true;
    this.stopTimer();
    this.lastActivityTime = 0;
  }

  ngOnDestroy() {
    this.forceStop();
  }
}
