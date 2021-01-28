import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    OnDestroy,
    OnInit,
    Optional,
    ChangeDetectorRef,
} from '@angular/core';
import { Subject, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { FormDirective } from 'src/app/business/commun/directive/form/form.directive';
import { EXPEND_ANIMATION_DURATION } from 'src/app/lib/animation/expend.animation';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';

@Component({
    selector: 'app-form-group',
    templateUrl: './form-group.component.html',
    styleUrls: ['./form-group.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGroupComponent implements OnDestroy, OnInit {
    @Input()
    @ListenPropertyChange()
    public collapsed = true;

    @Output()
    public collapsedChange = new EventEmitter<boolean>();

    @Input()
    public label: string;

    private _destroy = new Subject<void>();

    public constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Optional()
        private _form: FormDirective
    ) {}

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.openOnScrollToInvalid();
    }

    private openOnScrollToInvalid(): void {
        // Si le form group est fermé lorsque le FormDirective scroll vers le 1er élément
        // en erreur alors celui-ci n'est pas visible... On ouvre donc tous les form group avant de scroller.
        // Le timer est important car il y a une animation lors de l'ouverture, il faut donc attendre le temps de celle-ci.
        this._form.beforeScrollToInvalid(() => {
            this.collapsed = false;
            this._changeDetectorRef.markForCheck();

            return timer(EXPEND_ANIMATION_DURATION).pipe(mapTo(null));
        });
    }
}
