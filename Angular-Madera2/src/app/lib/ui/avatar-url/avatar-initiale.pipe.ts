import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforme un entite en initiale au format chaine de caractère un utilisant le nom des champs passés en paramétres.
 */
@Pipe({
    name: 'appAvatarInitiale'
})
export class AvatarInitialePipe implements PipeTransform {
    public transform(object: any, ...fields: string[]): string {
        return fields
            .filter(field => {
                const value: string = object[field];
                return value !== '' && value != null;
            })
            .map(field => {
                return (object[field] as string)[0].toUpperCase();
            })
            .join('');
    }
}
