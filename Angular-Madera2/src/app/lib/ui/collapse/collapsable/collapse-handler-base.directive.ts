import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { Directive, Input, EventEmitter, Output } from '@angular/core';

@Directive()
export abstract class CollapseHandlerBaseDirective {
    @Input()
    @ListenPropertyChange()
    public collapsed = true;

    @Output()
    public collapsedChange = new EventEmitter<boolean>();

    /**
     * Lorsque cette méthode est surchargée, elle permet au composant parent
     * de se transformer pour gérer la fonctionnalité de collapse (ex: CardComponent)
     */
    public activateCollapseHandler(): void {}
}
