import { Injectable, signal } from '@angular/core';

const KEY = 'vv-hits';
const SESSION_KEY = 'vv-counted';
// Retro counters never start at zero.
const BASE = 1337;

/**
 * Visitor counter. For now it counts per browser in localStorage.
 * To make it real, replace `load()` with a call to a backend
 * (e.g. a Firestore document incremented once per session).
 */
@Injectable({ providedIn: 'root' })
export class CounterService {
  readonly hits = signal(BASE);

  constructor() {
    this.load();
  }

  private load() {
    try {
      let n = Number(localStorage.getItem(KEY)) || 0;
      if (!sessionStorage.getItem(SESSION_KEY)) {
        n++;
        localStorage.setItem(KEY, String(n));
        sessionStorage.setItem(SESSION_KEY, '1');
      }
      this.hits.set(BASE + n);
    } catch {
      // Storage blocked (private mode etc.): keep the base number.
    }
  }
}
