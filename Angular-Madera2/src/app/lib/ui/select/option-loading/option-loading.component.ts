import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Optional,
} from '@angular/core';
import {
    NzOptionComponent,
    NzOptionGroupComponent,
} from 'ng-zorro-antd/select';

/*
 * Ce composant sert à afficher une option "Chargement en cours..." dans un nz-select.
 * A cause du fonctionnement de ce dernier on est obligé de passer par un héritage (+ provider),
 * tout autre composant ne serait pas passé via la projection (ng-content sélectif).
 * Par chance, le composant NzOptionComponent est actuellement une coquille vide
 * (pas de css et un template très simple) ce qui facilite cet héritage.
 *
 * Concernant l'utilisation, il faut conditionner l'affichage du composant via un *ngIf
 * (en se basant généralement sur le isLoading d'un ListLoader), ceci n'a pu être automatisé
 * via le ListLoader à cause d'une très grosse pertre de performance sur l'affichage des options (sans réelle explication).
 */
@Component({
    selector: 'app-option-loading',
    templateUrl: './option-loading.component.html',
    styleUrls: ['./option-loading.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NzOptionComponent,
            useExisting: OptionLoadingComponent,
            multi: true,
        },
    ],
})
export class OptionLoadingComponent
    extends NzOptionComponent
    implements OnInit {
    public constructor(
        @Optional()
        nzOptionGroup: NzOptionGroupComponent
    ) {
        super(nzOptionGroup);
    }

    public ngOnInit(): void {
        this.setInitialeState();
    }

    private setInitialeState(): void {
        this.nzDisabled = true;
        this.nzCustomContent = true;

        // D'après le code du nz-option (https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/components/select/option.component.ts#L61)
        // pour que l'affichage du composant soit à jour, à chaque changement des propriétés en @Input zorro pousse une nouvelle valeur
        // dans le Subject changes, du coup nous sommes obligés de faire la même chose car la mise à jour des propriétés via ts
        // ne déclenche pas le ngOnChanges
        this.changes.next();
    }
}
