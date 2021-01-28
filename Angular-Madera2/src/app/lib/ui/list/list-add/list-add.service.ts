import { Injectable, EventEmitter } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
/**
 * Service permettant au PageHeaderComponent de dupliquer
 * le bouton d'ajout (pour le mettre dans l'entête fixe)
 */
@Injectable()
export class ListAddService {
    public add = new EventEmitter<void>();

    public dropdownMenu: NzDropdownMenuComponent;

    public extraButtonList = [];

    public label: string;
}
