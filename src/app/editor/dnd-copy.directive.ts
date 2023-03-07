import { Directive, ElementRef, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { fromEvent } from 'rxjs';
import { mergeMap, map, takeUntil, finalize, skip } from 'rxjs/operators';

export interface PositionModel {
  element?: HTMLElement;
  left: number;
  top: number;
}

@Directive({
  selector: '[app-dnd-copy]'
})
export class DndCopyDirective implements OnInit {

  @Input('drop-selector') dropSelector = ''

  @Input('proxy-scale') proxyScale: number = 0.8

  @Output() dragged: EventEmitter<void> = new EventEmitter()

  @Output() dropped: EventEmitter<PositionModel> = new EventEmitter()

  @Output() clicked: EventEmitter<PositionModel> = new EventEmitter()

  @Output() cancelled: EventEmitter<void> = new EventEmitter()

  constructor(private element: ElementRef) {
  }

  ngOnInit() {

    if (this.dropSelector === undefined) {
      return;
    }

    const source = this.element.nativeElement;

    const mousedown = fromEvent<MouseEvent>(source, 'mousedown');
    const mousemove = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup = fromEvent<MouseEvent>(document, 'mouseup');

    let proxy: HTMLElement | null = null

    let emitted = false;

    const copyObserver = mousedown.pipe(
      mergeMap((md: MouseEvent) => {

      let target = md.target;

      if (source.contains(target)) {
        target = source;
      }

      md.preventDefault(); /* prevents parent to scroll while moving child */

      const startX = md.clientX - source.getBoundingClientRect().left;
      const startY = md.clientY - source.getBoundingClientRect().top;

      return mousemove.pipe(
        skip(5),
        map((mm: any) => {

          if (proxy === null) {

            proxy = source.cloneNode(true) as HTMLElement
            proxy.style.position = 'absolute';
            proxy.style.width = source.offsetWidth + 'px';
            proxy.style.height = source.offsetHeight + 'px';
            proxy.style.transform = `scale(${this.proxyScale})`
            proxy.style.backgroundColor = source.backgroundColor;
            proxy.style.backgroundImage = source.backgroundImage;
            proxy.style.backgroundSize = source.backgroundSize;
            proxy.style.borderRadius = source.borderRadius;
            proxy.style.border = source.border;

            proxy.style.opacity = '0.8';
            proxy.style.zIndex = '100000';
            document.body.appendChild(proxy);
          }

          if (!emitted) {
            this.dragged.emit();
            emitted = true;
          }

          const dropElements = Array.from(document.querySelectorAll(this.dropSelector));

          dropElements
            .map((dropElement) => {
              dropElement.classList.remove('outline');
              return dropElement;
            })
            .filter(dropElement => this.intersectRect(proxy!, dropElement as HTMLElement))
            .forEach((dropElement) => {
              dropElement.classList.add('outline');
            });

          return {
            top: mm.clientY - startY,
            left: mm.clientX - startX
          };
        }),
        takeUntil(mouseup),
        finalize(() => {

          emitted = false;

          this.clicked.emit();

          if (proxy === null) {
            return
          }

          const dropElements = Array.from(document.querySelectorAll(this.dropSelector));

          let found = false

          dropElements
            .filter(dropElement => this.intersectRect(proxy!, dropElement as HTMLElement))
            /* Avoid overlayed elements below to match, take only the last on in the DOM  */
            .filter((value, index, arr) => index === arr.length - 1)
            .forEach((dropElement) => {

              const position: PositionModel = {
                left: Math.round(proxy!.getBoundingClientRect().left),
                top: Math.round(proxy!.getBoundingClientRect().top),
                element: dropElement as HTMLElement
              }

              position.left += dropElement.scrollLeft
              position.top += dropElement.scrollTop

              dropElement.classList.remove('outline')

              this.dropped.emit(position)

              found = true
            })

          if (!found) {
            this.cancelled.emit()
          }

          document.body.removeChild(proxy);
          proxy = null;

        })
      );

    }));

    copyObserver.subscribe((event: any) => {
      proxy!.style.top = event.top + 'px';
      proxy!.style.left = event.left + 'px';
    });
  }

  private intersectRect(proxy: HTMLElement, drop: HTMLElement) {

    const proxyRect = proxy.getBoundingClientRect();
    const dropRect = drop.getBoundingClientRect();

    return Math.max(proxyRect.left, dropRect.left) < Math.min(proxyRect.left + proxyRect.width, dropRect.left + dropRect.width) &&
      Math.max(proxyRect.top, dropRect.top) < Math.min(proxyRect.top + proxyRect.height, dropRect.top + dropRect.height);
  }
}
