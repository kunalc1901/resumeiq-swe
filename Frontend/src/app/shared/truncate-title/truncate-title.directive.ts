import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
} from '@angular/core';

/**
 * Shows a native tooltip with the element's full text only when the text is
 * truncated or wraps past its container. No tooltip is added for short names.
 */
@Directive({
  standalone: true,
  selector: '[appTruncateTitle]',
})
export class TruncateTitleDirective implements AfterViewInit, OnDestroy {
  private observer: ResizeObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.update();
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.update());
      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private update(): void {
    const host = this.el.nativeElement;
    const full = host.textContent?.trim() || '';
    const overflow =
      host.scrollWidth > host.clientWidth + 1 ||
      host.scrollHeight > host.clientHeight + 1;
    if (overflow && full) {
      host.title = full;
    } else {
      host.removeAttribute('title');
    }
  }
}