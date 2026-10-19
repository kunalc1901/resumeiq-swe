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

/**
 * Resume upload dialog (UI-only for now).
 *
 * Visual states are wired for demonstration (drag highlight, browse picker),
 * but no file handling, upload or save logic is implemented yet.
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
  @Output() upload = new EventEmitter<{ name: string; size: number }>();

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropzone') private dropzone!: ElementRef<HTMLElement>;

  /** Visual state for the drag & drop zone (animation only). */
  dragging = false;

  /** True while the card animates toward the notification bell. */
  flying = false;

  private flyTimer: ReturnType<typeof setTimeout> | null = null;

  /** File shown in the dialog once the user browses or drops one (UI state). */
  selectedFile: { name: string; size: number } | null = null;

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
      this.upload.emit({ name: file.name, size: file.size });
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
    this.selectedFile = { name: file.name, size: file.size };
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