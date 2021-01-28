import {
    Output,
    EventEmitter,
    OnDestroy,
    Directive,
    AfterViewInit,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormEvent } from './form-event';
import { merge, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FormActionBarComponent } from '../form-action-bar/form-action-bar.component';

/**
 * Classe abstraite représentant la base d'un composant formulaire
 */
@Directive()
export abstract class FormDirective
    implements AfterViewInit, FormEvent, OnDestroy {
    /**
     * Événement déclenché lorsque la ressource a été archivée
     */
    @Output()
    public archive = new EventEmitter<void>();

    /**
     * Evénement déclenché lors de l'annulation
     */
    public cancel = new EventEmitter<void>();

    /**
     * Événement déclenché lors de la complétion d'une action sur la ressource
     * (submit, archive, delete)
     */
    @Output()
    public complete = new EventEmitter<any>();

    /**
     * Événement déclenché lorsque la ressource a été supprimée
     */
    @Output()
    public delete = new EventEmitter<void>();

    public abstract form: FormGroup | FormArray;

    /**
     * Événement déclenché lorsque la ressource a été enregistrée
     */
    @Output()
    public save = new EventEmitter<any>();

    /**
     * Largeur souhaitee du composant
     */
    public width: number;

    protected _destroy = new Subject<void>();

    @ViewChild(FormActionBarComponent)
    private _formActionBar: FormActionBarComponent;

    public constructor() {
        this.handleComplete();
    }

    public ngAfterViewInit(): void {
        this.listenFormActionBarEvent();
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public abstract submit(...args: any[]): false | void;

    private handleComplete(): void {
        merge(this.archive, this.cancel, this.delete)
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.complete.emit());

        this.save
            .pipe(takeUntil(this._destroy))
            .subscribe((r) => this.complete.emit(r));
    }

    private listenFormActionBarEvent(): void {
        this._formActionBar?.canceled
            .pipe(
                takeUntil(this._destroy),
                switchMap(() => this._formActionBar.canLeave(this.form)),
                filter((cancel) => cancel)
            )
            .subscribe(() => {
                this.form.markAsPristine();
                this.cancel.emit();
            });
    }
}
