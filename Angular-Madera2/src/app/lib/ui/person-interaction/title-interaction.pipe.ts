import { InteractionEnum } from 'src/app/core/enum/interaction.enum';
import { PipeTransform, Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'appTitleInteraction'
})
export class TitleInteractionPipe implements PipeTransform {
    public transform(object: InteractionEnum): string {
        if (object != null) {
            if (object === InteractionEnum.organismeFormation) {
                return 'Organisme Formation';
            } else if (object === InteractionEnum.apprenant) {
                return 'Apprenant';
            } else if (object === InteractionEnum.entreprise) {
                return 'Entreprise';
            } else if (object === InteractionEnum.prospect) {
                return 'Prospect';
            }
        }
    }
}
