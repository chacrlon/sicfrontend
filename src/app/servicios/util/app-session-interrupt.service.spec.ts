import { TestBed } from '@angular/core/testing';

import { AppSessionInterruptService } from './app-session-interrupt.service';

describe('AppSessionInterruptService', () => {
  let service: AppSessionInterruptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSessionInterruptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
