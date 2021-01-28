import { Pipe, PipeTransform } from '@angular/core';
import { MediaImageService } from 'src/app/core/service/media/media-image.service';

/**
 * Transforme une personne en url de son avatar
 */
@Pipe({
    name: 'appAvatarUrl',
})
export class AvatarUrlPipe implements PipeTransform {
    public constructor(private _mediaImageService: MediaImageService) {}

    public transform(object: any, field: string = 'imageMediaId'): string {
        const imageId = object[field];
        if (imageId !== '' && imageId != null) {
            return this._mediaImageService.getOrganismeUrl(imageId, 72);
        }
        return '';
    }
}
