import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestRessource } from 'src/app/lib/rest/rest-resource';

export interface Archivable {
    archive(): Observable<void>;
}

const jsonHeader = new HttpHeaders({
    'Content-Type': 'application/json'
});

export function AddArchive() {
    return <
        Constructor extends new (...input: any[]) => RestRessource<any, any>
    >(
        target: Constructor
    ) => {
        return class extends target implements Archivable {
            public archive(): Observable<void> {
                return this._http.post<void>(
                    `${this._path}/${this._id}/archive`,
                    {},
                    { headers: jsonHeader }
                );
            }
        };
    };
}
