import {
    Directive,
    Input,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { isArray, isEmpty, isString } from 'lodash';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';

@Directive({
    selector: '[appNoData]',
    exportAs: 'appNoData',
})
export class NoDataDirective<Data> implements HandlePropertyChange, OnInit {
    @Input('appNoData')
    @ListenPropertyChange()
    public data: Data;

    private _placeholder: Text;

    public constructor(
        private _renderer: Renderer2,
        private _templateRef: TemplateRef<void>,
        private _viewContainerRef: ViewContainerRef
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.data) {
            this.updateRendering();
        }
    }

    public ngOnInit(): void {
        this.updateRendering();
    }

    private updateRendering(): void {
        this._viewContainerRef.clear();

        if (this._placeholder != null) {
            this._renderer.removeChild(
                this._placeholder.parentElement,
                this._placeholder
            );
        }

        if (
            this.data == null ||
            ((isArray(this.data) || isString(this.data)) && isEmpty(this.data))
        ) {
            this._placeholder = this._renderer.createText('-');
            this._renderer.insertBefore(
                this._viewContainerRef.element.nativeElement.parentElement,
                this._placeholder,
                this._viewContainerRef.element.nativeElement
            );

            return;
        }

        this._viewContainerRef.createEmbeddedView(this._templateRef);
    }
}
