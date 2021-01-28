import { HttpClient } from '@angular/common/http';
import { RestRessource } from 'src/app/lib/rest/rest-resource';
import { MatiereRequest } from './matiere.request';
import { MatiereEntity } from 'src/app/core/entity/matiere/matiere.entity';
import {
    AddPrepareDelete,
    Deletable
} from 'src/app/core/decorator/add-prepare-delete/add-prepare-delete.decorator';
import {
    Archivable,
    AddArchive
} from 'src/app/core/decorator/add-archive/add-archive.decorator';

export interface MatiereRestResource extends Archivable, Deletable {}

@AddArchive()
@AddPrepareDelete()
export class MatiereRestResource extends RestRessource<
    MatiereEntity,
    MatiereRequest
> {
    public constructor(path: string, id: number, http: HttpClient) {
        super(path, id, http);
    }
}
