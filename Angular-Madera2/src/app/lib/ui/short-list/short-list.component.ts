import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-short-list',
    templateUrl: './short-list.component.html',
    styleUrls: ['./short-list.component.css'],
})
export class ShortListComponent {
    /**
     * Template pour personnaliser le rendu d'un item de liste
     */
    @Input()
    public itemTemplate: TemplateRef<any>;

    /**
     * Liste des éléments à afficher
     *
     * Par défaut c'est une liste de type scalaire, pour tout autre valeur
     * il faut passer par le template pour afficher correctement les valeurs
     */
    @Input()
    public list: any[] = [];
}
