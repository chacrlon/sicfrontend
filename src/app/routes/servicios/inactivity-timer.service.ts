import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, timer, interval, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SessionTimeoutDialogComponentComponent } from '../session-timeout-dialog-component/session-timeout-dialog-component.component';

@Injectable({
  providedIn: 'root'
})
export class InactivityTimerService implements OnDestroy {

  private readonly SESSION_TIMEOUT = 120000; // 2 minutos
  private lastActivityTime = Date.now();
  private timerSub!: Subscription;
  private countdownSub!: Subscription;
  private activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
  private activitySubject = new Subject<void>();
  private boundHandleActivity: () => void;
  private destroyed$ = new Subject<void>(); // <- Añadir esto

  constructor(private router: Router, private dialog: MatDialog) {
    this.boundHandleActivity = this.handleUserActivity.bind(this);
  }

  startTimer() {
    this.setupActivityListeners();
    this.resetTimer();
  }

  stopTimer() {
    this.destroyed$.next();
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
    if (now - this.lastActivityTime > 1000) {
      this.lastActivityTime = now;
      this.resetTimer();
    }
  }

  private resetTimer() {
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();

    // Usar takeUntil para limpiar automáticamente
    this.timerSub = timer(this.SESSION_TIMEOUT)
      .pipe(takeUntil(this.destroyed$)) // <- Añadir
      .subscribe(() => this.showTimeoutDialog());

      this.countdownSub = interval(1000)
      .pipe(takeUntil(this.destroyed$)) // <- Añadir
      .subscribe(() => {
        const remaining = Math.max(0, this.SESSION_TIMEOUT - (Date.now() - this.lastActivityTime));
        console.log(`Tiempo restante: ${Math.floor(remaining / 1000)}s`);
        return
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
    sessionStorage.clear();
    this.stopTimer();
    this.router.navigateByUrl('/auth/login');
  }

// Modifica el método forceStop para asegurar la limpieza completa
forceStop() {
  this.destroyed$.next();
  this.stopTimer();
  // Limpiar cualquier estado residual
  this.lastActivityTime = 0;
}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.countdownSub.unsubscribe();
    this.destroyed$.unsubscribe();
  }
}
