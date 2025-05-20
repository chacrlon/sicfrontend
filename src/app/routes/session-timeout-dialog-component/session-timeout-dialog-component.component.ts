import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-session-timeout-dialog-component',
  templateUrl: './session-timeout-dialog-component.component.html',
  styleUrls: ['./session-timeout-dialog-component.component.scss']
})
export class SessionTimeoutDialogComponentComponent implements OnInit, OnDestroy {
  countdown: number = 10;
  private countdownSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SessionTimeoutDialogComponentComponent>
  ) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    this.countdownSub = timer(0, 1000).subscribe((elapsed) => {
      this.countdown = 10 - elapsed;
      if (this.countdown <= 0) {
        this.dialogRef.close('logout');
      }
    });
  }

  extendSession(): void {
    this.dialogRef.close('extend');
    this.countdownSub.unsubscribe(); // Detener el contador actual
  }

  logout(): void {
    this.dialogRef.close('logout');
  }

  ngOnDestroy(): void {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }

}
