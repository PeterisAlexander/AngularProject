import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive pour transformer le composant statistic en filtre
 */
@Directive({
    selector: '[appStatisticFilter]'
})
export class StatisticFilterDirective {
    @HostBinding('class.appStatisticFilter-active')
    @Input()
    public filterIsActive = false;

    @HostBinding('class.cursorPointer')
    public hostClassPointer = true;
}
