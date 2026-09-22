import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

/**
 * Adds a `.revealed` class when the element scrolls into view.
 * Pair with the global `[appReveal]` CSS transition in styles.scss.
 * Falls back to visible immediately when IntersectionObserver is unavailable.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private readonly element: HTMLElement;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (!('IntersectionObserver' in window)) {
      this.element.classList.add('revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.element.classList.add('revealed');
            this.observer?.unobserve(this.element);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(this.element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}