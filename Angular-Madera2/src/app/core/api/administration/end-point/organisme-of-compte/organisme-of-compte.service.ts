import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganismeFormationEntity } from 'src/app/core/entity/authentification/organisme-formation.entity';

export class OrganismeOfCompteService {
    public constructor(
        private _path: string,

        private _http: HttpClient
    ) {}

    /**
     * Retourne la liste des organismes du compte courant
     */
    public getAll(): Observable<OrganismeFormationEntity[]> {
        return this._http.get<OrganismeFormationEntity[]>(this._path);
    }
}
