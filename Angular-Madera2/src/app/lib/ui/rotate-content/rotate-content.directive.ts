import {
    Directive,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
} from '@angular/core';
import { interval, merge, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appRotateContent]',
})
export class RotateContentDirective implements OnInit, OnDestroy {
    private _destroy = new Subject<void>();

    public constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    ) {}

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.setInitialDisplay();
    }

    private setInitialDisplay(): void {
        const children = Array.from(this._elementRef.nativeElement.children);

        this._renderer.setStyle(
            this._elementRef.nativeElement,
            'display',
            'flex'
        );
        this._renderer.setStyle(
            this._elementRef.nativeElement,
            'align-items',
            'center'
        );

        this._renderer.setStyle(
            this._elementRef.nativeElement,
            'justify-content',
            'center'
        );

        children.forEach((c) => this._renderer.addClass(c, 'rotate270'));

        merge(of(null), interval(1000))
            .pipe(
                map(
                    () =>
                        this._elementRef.nativeElement.getBoundingClientRect()
                            .height
                ),
                distinctUntilChanged(),
                takeUntil(this._destroy)
            )
            .subscribe((w) =>
                children.forEach((c) =>
                    this._renderer.setStyle(c, 'width', `${w}px`)
                )
            );
    }
}
