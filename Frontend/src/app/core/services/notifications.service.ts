import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/** Progress bar and filename for an in-flight upload. */
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

/** Emitted when an upload fails so the panel can show a notification. */
export interface UploadFailed {
  id: string;
  fileName: string;
}

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
 * Tracks real upload progress for the notification panel. Callers create a
 * task with startUpload(), push S3 upload progress with updateUpload(), then
 * finish with completeUpload() or failUpload().
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private uploadsSubject = new BehaviorSubject<UploadTask[]>([]);
  /** Live uploads, newest last. */
  uploads$ = this.uploadsSubject.asObservable();

  private completedSubject = new Subject<UploadCompleted>();
  /** Fires when an upload finishes (task removed from uploads$). */
  completed$ = this.completedSubject.asObservable();

  private failedSubject = new Subject<UploadFailed>();
  /** Fires when an upload fails (task removed from uploads$). */
  failed$ = this.failedSubject.asObservable();

  /** Prevents duplicate completion/failure handling for the same task. */
  private finalizing = new Set<string>();

  /**
   * Registers a new upload task at 0%.
   * @returns The task id used by updateUpload/completeUpload/failUpload
   */
  startUpload(fileName: string, sizeBytes: number): string {
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const task: UploadTask = {
      id,
      fileName,
      sizeLabel: formatFileSize(sizeBytes),
      progress: 0,
    };
    this.uploadsSubject.next([...this.uploadsSubject.value, task]);
    return id;
  }

  /** Updates an upload's progress, clamped to 0-100. */
  updateUpload(id: string, progress: number): void {
    const next = Math.max(0, Math.min(100, Math.round(progress)));
    this.uploadsSubject.next(
      this.uploadsSubject.value.map((task) =>
        task.id === id ? { ...task, progress: next } : task,
      ),
    );
  }

  /** Marks an upload complete, then removes it and emits completed$. */
  completeUpload(id: string): void {
    if (this.finalizing.has(id)) {
      return;
    }
    const task = this.uploadsSubject.value.find((item) => item.id === id);
    if (!task) {
      return;
    }

    this.finalizing.add(id);
    this.updateUpload(id, 100);
    setTimeout(() => {
      this.finalizing.delete(id);
      this.uploadsSubject.next(
        this.uploadsSubject.value.filter((item) => item.id !== id),
      );
      this.completedSubject.next({ id, fileName: task.fileName });
    }, FINALIZE_MS);
  }

  /** Removes a failed upload and emits failed$. */
  failUpload(id: string): void {
    if (this.finalizing.has(id)) {
      return;
    }
    const task = this.uploadsSubject.value.find((item) => item.id === id);
    if (!task) {
      return;
    }

    this.finalizing.add(id);
    this.uploadsSubject.next(
      this.uploadsSubject.value.filter((item) => item.id !== id),
    );
    this.finalizing.delete(id);
    this.failedSubject.next({ id, fileName: task.fileName });
  }
}
