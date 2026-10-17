import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/** Progress bar and filename for a UI-only (mock) upload. */
export interface UploadTask {
  id: string;
  fileName: string;
  /** Pre-formatted size label, e.g. "254 KB". */
  sizeLabel: string;
  /** 0 - 100. */
  progress: number;
}

/** Emitted when an upload task finishes. */
export interface UploadCompleted {
  id: string;
  fileName: string;
}

const TICK_MS = 90;
const FINALIZE_MS = 420;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Mock upload progress for the notification panel.
 *
 * UI-only: simulates the upload lifecycle (0 → 100%, then finalize) so the
 * notification panel can be built before real upload APIs exist.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private uploadsSubject = new BehaviorSubject<UploadTask[]>([]);
  /** Live uploads, newest last. */
  uploads$ = this.uploadsSubject.asObservable();

  private completedSubject = new Subject<UploadCompleted>();
  /** Fires when an upload finishes (task removed from uploads$). */
  completed$ = this.completedSubject.asObservable();

  startUpload(fileName: string, sizeBytes: number): void {
    const id = `upload-${Date.now()}`;
    const task: UploadTask = {
      id,
      fileName,
      sizeLabel: formatFileSize(sizeBytes),
      progress: 0,
    };
    this.uploadsSubject.next([...this.uploadsSubject.value, task]);

    const interval = setInterval(() => {
      const tasks = this.uploadsSubject.value;
      const current = tasks.find((t) => t.id === id);
      if (!current) {
        clearInterval(interval);
        return;
      }
      const next = Math.min(100, current.progress + 2 + Math.round(Math.random() * 7));
      if (next >= 100) {
        clearInterval(interval);
        // Bar full: short "finalizing" pause, then remove + notify.
        this.uploadsSubject.next(
          tasks.map((t) => (t.id === id ? { ...t, progress: 100 } : t)),
        );
        setTimeout(() => {
          this.uploadsSubject.next(this.uploadsSubject.value.filter((t) => t.id !== id));
          this.completedSubject.next({ id, fileName });
        }, FINALIZE_MS);
      } else {
        this.uploadsSubject.next(
          tasks.map((t) => (t.id === id ? { ...t, progress: next } : t)),
        );
      }
    }, TICK_MS);
  }
}