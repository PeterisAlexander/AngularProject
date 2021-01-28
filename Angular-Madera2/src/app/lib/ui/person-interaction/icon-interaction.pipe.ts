import { Pipe, PipeTransform } from '@angular/core';
import { InteractionEnum } from 'src/app/core/enum/interaction.enum';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'appIconInteraction'
})
export class IconInteractionPipe implements PipeTransform {
    public transform(object: InteractionEnum): string {
        if (object != null) {
            if (object === InteractionEnum.organismeFormation) {
                return 'illustration:cs-carron-organisme-formation';
            } else if (object === InteractionEnum.apprenant) {
                return 'illustration:cs-carron-apprenant';
            } else if (object === InteractionEnum.entreprise) {
                return 'illustration:cs-carron-entreprise';
            } else if (object === InteractionEnum.prospect) {
                return 'illustration:cs-carron-prospect';
            }
        }
    }
}
