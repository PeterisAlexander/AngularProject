import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrepareDeleteResponse } from '../../api/business/end-point/commun/prepare-delete-response';
import { RestRessource } from 'src/app/lib/rest/rest-resource';

export interface Deletable<TPrepareResponse = PrepareDeleteResponse> {
    prepareDelete<TResponse = TPrepareResponse>(): Observable<TResponse>;
}

const jsonHeader = new HttpHeaders({
    'Content-Type': 'application/json',
});

export function AddPrepareDelete<TPrepareResponse = PrepareDeleteResponse>() {
    return <
        Constructor extends new (...input: any[]) => RestRessource<any, any>
    >(
        target: Constructor
    ) => {
        return class extends target implements Deletable {
            public prepareDelete<TResponse = TPrepareResponse>(): Observable<
                TResponse
            > {
                return this._http.post<TResponse>(
                    `${this._path}/${this._id}/prepare-delete`,
                    {},
                    { headers: jsonHeader }
                );
            }
        };
    };
}
