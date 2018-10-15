import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable, fromEvent, merge } from 'rxjs';
import { map, tap, mergeMap, takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-resize-me',
  templateUrl: './resize-me.component.html',
  styleUrls: ['./resize-me.component.scss']
})
export class ResizeMeComponent implements OnInit {

  @ViewChild('hgripper') hGripper: ElementRef;
  @ViewChild('vgripper') vGripper: ElementRef;
  @ViewChild('bothgripper') bothGripper: ElementRef;
  @ViewChild('root') modalRoot: ElementRef;

  hGripperMouseDown$: Observable<MouseEvent>;
  vGripperMouseDown$: Observable<MouseEvent>;
  bothGripperMouseDown$: Observable<MouseEvent>;
  isHResizing: boolean;
  isVResizing: boolean;
  isBothResizing: boolean;

  lastPageX: number;
  lastPageY: number;

  windowMouseMove$: Observable<MouseEvent>;
  windowMouseUp$: Observable<MouseEvent>;
  mergedObs$: Observable<MouseEvent>;
  obs$: Observable<MouseEvent>;

  constructor() { }

  ngOnInit() {



    this.obs$ = fromEvent(this.hGripper.nativeElement, 'mousedown')
                .pipe(
                  map((e: MouseEvent) => {

                      this.modalRoot.nativeElement.classList.add('resizing');
                      return e;
                    }
                  ),

                  mergeMap((mouseDown: MouseEvent) => {
                      let mouseDownPageX = mouseDown.pageX;

                      return fromEvent(window, 'mousemove')
                            .pipe(
                              tap((mouseMove: MouseEvent) => {
                                  document.body.style.cursor = 'e-resize';
                                  const deltaX = mouseMove.pageX - mouseDownPageX;
                                  const newWidth = this.modalRoot.nativeElement.offsetWidth + deltaX;
                                  this.modalRoot.nativeElement.style.width = newWidth + 'px';
                                  mouseDownPageX = mouseMove.pageX;
                                }
                              ),
                              takeUntil(this.windowMouseUp$)
                            );
                  })
                );

    this.hGripperMouseDown$ = fromEvent(this.hGripper.nativeElement, 'mousedown')
                                .pipe(
                                  tap((e: MouseEvent) => {
                                    this.isHResizing = true;
                                    this.lastPageX = e.pageX;
                                    this.lastPageY = e.pageY;
                                    this.modalRoot.nativeElement.classList.add('resizing');
                                  }),
                                  mergeMap(() => {
                                    return this.windowMouseMove$.pipe(
                                      takeUntil(this.windowMouseUp$)
                                    );
                                  })
                                );

      this.vGripperMouseDown$ = fromEvent(this.vGripper.nativeElement, 'mousedown')
                                .pipe(
                                  tap((e: MouseEvent) => {
                                    this.isVResizing = true;
                                    this.lastPageX = e.pageX;
                                    this.lastPageY = e.pageY;
                                    this.modalRoot.nativeElement.classList.add('resizing');
                                  }),
                                  mergeMap(() => {
                                    return this.windowMouseMove$.pipe(
                                      takeUntil(this.windowMouseUp$)
                                    );
                                  })
                                );

      this.bothGripperMouseDown$ = fromEvent(this.bothGripper.nativeElement, 'mousedown')
                                .pipe(
                                  tap((e: MouseEvent) => {
                                    this.isBothResizing = true;
                                    this.lastPageX = e.pageX;
                                    this.lastPageY = e.pageY;
                                    this.modalRoot.nativeElement.classList.add('resizing');
                                  }),
                                  mergeMap(() => {
                                    return this.windowMouseMove$.pipe(
                                      takeUntil(this.windowMouseUp$)
                                    );
                                  })
                                );

    this.windowMouseMove$ = fromEvent(window, 'mousemove')
                              .pipe(
                                tap((e: MouseEvent) => {
                                    this.resize(e);
                                  }
                                )
                              );

    this.windowMouseUp$ = fromEvent(window, 'mouseup')
                              .pipe(
                                tap((e: MouseEvent) => {
                                    this.endResize();
                                  }
                                )
                              );


    this.mergedObs$ = merge(this.hGripperMouseDown$, this.bothGripperMouseDown$, this.vGripperMouseDown$);

  }

  initResize(event: MouseEvent) {


  }

  endResize() {
    document.body.style.cursor = 'unset';
    this.modalRoot.nativeElement.classList.remove('resizing');
  }

  resize(e: MouseEvent) {

    const pageX: number = e.pageX;
    const pageY: number = e.pageY;

    if (this.isHResizing || this.isVResizing || this.isBothResizing) {
      // console.log(`lastPageX--->${this.lastPageX} and newpageX--->${pageX}`);
      document.body.style.cursor = 'e-resize';
      console.log(this.lastPageX);
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const containerWidth = this.modalRoot.nativeElement.offsetWidth;
      const containerHeight = this.modalRoot.nativeElement.offsetHeight;
      const newWidth = containerWidth + deltaX;
      const newHeight = containerHeight + deltaY;
      // console.log(`containerWidth--->${containerWidth} and deltaX--->${deltaX}`);
      if (this.isHResizing || this.isBothResizing) {
        // if (newWidth > this.minWidth) {
        //   this.modalRoot.nativeElement.style.width = newWidth + 'px';
        // }
        this.modalRoot.nativeElement.style.width = newWidth + 'px';
      }

      if (this.isBothResizing || this.isVResizing) {
        // if (newHeight > this.minHeight) {
        //   this.modalRoot.nativeElement.style.height = newHeight + 'px';
        //   // this.modalBody.nativeElement.style.height = contentHeight + deltaY + 'px';
        //   // this.modalBody.nativeElement.style.maxHeight = 'none';
        // }

        this.modalRoot.nativeElement.style.height = newHeight + 'px';
      }

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }
}
