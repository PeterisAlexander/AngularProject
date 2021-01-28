import { Component, Input } from '@angular/core';

import { PersonneInteractionService } from 'src/app/core/service/personne-interaction/personne-interaction.service';
import { PersonneEntity } from 'src/app/core/entity/personne/personne.entity';

/**
 * Composant permettant de faire afficher les interactions d'une personne
 */
@Component({
    selector: 'app-person-interaction',
    templateUrl: './person-interaction.component.html',
    styleUrls: ['./person-interaction.component.css'],
})
export class PersonInteractionComponent {
    /**
     * Personne dont on souhaite faire afficher les interactions
     */
    @Input()
    public personne: PersonneEntity;

    public constructor(
        /**
         * Permet d'obtenir les interactions d'une personne
         */
        public personneInteractionService: PersonneInteractionService
    ) {}
}
