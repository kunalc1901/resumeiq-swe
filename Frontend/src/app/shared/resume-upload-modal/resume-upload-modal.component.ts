import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Resume upload dialog. Validates the picked/dropped file and hands the File
 * to the parent, which performs the S3 upload.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-resume-upload-modal',
  templateUrl: './resume-upload-modal.component.html',
  styleUrls: ['./resume-upload-modal.component.scss'],
})
export class ResumeUploadModalComponent implements OnDestroy {
  private _open = false;

  /** While open, lock body scroll so the page behind the dialog can't move. */
  @Input()
  set open(value: boolean) {
    this._open = value;
    document.body.style.overflow = value ? 'hidden' : '';
  }
  get open(): boolean {
    return this._open;
  }

  @Output() dismiss = new EventEmitter<void>();

  /** Emitted after the confirm animation, when the dialog "flies into" the bell. */
  @Output() upload = new EventEmitter<File>();

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropzone') private dropzone!: ElementRef<HTMLElement>;

  /** Visual state for the drag & drop zone (animation only). */
  dragging = false;

  /** True while the card animates toward the notification bell. */
  flying = false;

  private flyTimer: ReturnType<typeof setTimeout> | null = null;

  /** File selected by the user, or null when nothing is chosen. */
  selectedFile: File | null = null;

  /** User-facing validation message (technical details never go here). */
  uploadError = '';

  onUploadConfirm(): void {
    const file = this.selectedFile;
    if (!file || this.flying) {
      return;
    }
    // "Fly into the bell" animation, then hand over to the parent so the
    // notification panel can open with a live progress item.
    this.flying = true;
    this.flyTimer = setTimeout(() => {
      this.flyTimer = null;
      this.flying = false;
      this.selectedFile = null;
      this.upload.emit(file);
    }, 440);
  }

  onDismiss(): void {
    if (this.flyTimer) {
      clearTimeout(this.flyTimer);
      this.flyTimer = null;
    }
    this.flying = false;
    this.dragging = false;
    this.selectedFile = null;
    this.uploadError = '';
    this.dismiss.emit();
  }

  openPicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.setSelectedFile(file);
    }
    // Clear the input so picking the same file again still fires 'change'.
    input.value = '';
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const zone = this.dropzone?.nativeElement;
    if (!zone || !zone.contains(event.relatedTarget as Node)) {
      this.dragging = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setSelectedFile(file);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.uploadError = '';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  private setSelectedFile(file: File): void {
    const isPdf =
      file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      this.selectedFile = null;
      this.uploadError = 'Only PDF files are supported.';
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.selectedFile = null;
      this.uploadError = 'This file is too large. The maximum size is 10 MB.';
      return;
    }
    this.uploadError = '';
    this.selectedFile = file;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.onDismiss();
    }
  }

  ngOnDestroy(): void {
    // Never leave the page scroll-locked if the component is torn down.
    document.body.style.overflow = '';
  }
}