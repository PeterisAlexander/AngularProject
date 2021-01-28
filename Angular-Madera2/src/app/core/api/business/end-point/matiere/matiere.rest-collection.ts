import { HttpClient } from '@angular/common/http';
import { RestCollection } from 'src/app/lib/rest/rest-collection';
import { MatiereRestResource } from './matiere.rest-resource';
import { MatiereRequest } from './matiere.request';
import { MatiereEntity } from 'src/app/core/entity/matiere/matiere.entity';

export class MatiereRestCollection extends RestCollection<
    MatiereRestResource,
    MatiereEntity,
    MatiereRequest,
    MatiereRequest[]
> {
    public constructor(path: string, http: HttpClient) {
        super(path, http, MatiereRestResource);
    }
}
