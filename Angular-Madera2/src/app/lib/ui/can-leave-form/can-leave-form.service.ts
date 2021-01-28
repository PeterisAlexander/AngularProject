import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { without } from 'lodash';
import { ModalService } from 'src/app/business/commun/service/modal/modal.service';

/**
 * Service permettant d'empêcher au besoin l'utilisateur de quitter la page courante,
 * ex: en édition de formulaire pour éviter de perdre des données
 */
@Injectable({
    providedIn: 'root'
})
export class CanLeaveFormService implements OnDestroy {
    private _destroy = new Subject<void>();

    /**
     * Liste contenant toutes les fonctions pouvant empêcher l'utilisateur de quitter la page.
     */
    private _blockers: Array<() => boolean> = [];

    public constructor(private _modal: ModalService) {}

    /**
     * Ajout d'un bloqueur empêchant au besoin l'utilisateur de quitter la page
     */
    public addBlocker(canLeaveFn: () => boolean): void {
        this._blockers.push(canLeaveFn);
    }

    /**
     * Retourne si les bloqueurs autorisent l'utilisateur à quitter la page
     */
    public canLeave(): boolean {
        for (const fn of this._blockers.values()) {
            if (!fn()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Retourne si les bloqueurs autorisent l'utilisateur à quitter la page
     * ou si l'utilisateur a confirmé vouloir quitter la page
     */
    public canLeaveOrConfirm(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            if (this.canLeave()) {
                observer.next(true);
                return;
            }

            this._modal.confirm({
                nzTitle: 'Quitter la page ?',
                nzContent: `Les modifications que vous avez apportées ne seront peut-être pas enregistrées.`,
                nzOkText: 'Quitter',
                nzCancelText: 'Rester',
                nzOnOk: () => observer.next(true),
                nzOnCancel: () => observer.next(false)
            });
        });
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    /**
     * suppression d'un bloqueur (composant/directive) empêchant au besoin l'utilisateur de quitter la page
     */
    public removeBlocker(blocker: () => boolean): void {
        this._blockers = without(this._blockers, blocker);
    }
}
