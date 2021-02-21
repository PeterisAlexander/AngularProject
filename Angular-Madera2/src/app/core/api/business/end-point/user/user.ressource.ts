import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from 'src/app/core/entity/user/user.entity';
import { UserRequest } from './user.request';

export class UserResource {
    public constructor(private _http: HttpClient, private _path: string) {}

    public add(data: UserRequest): Observable<UserEntity> {
        return this._http.post<UserEntity>(this._path, data);
    }

    public delete(id: number): Observable<boolean> {
        return this._http
            .delete<{ deleted: boolean }>(`${this._path}/${id}`)
            .pipe(map((r) => r.deleted));
    }

    public get(id: number): Observable<UserEntity> {
        return this._http.get<UserEntity>(`${this._path}/${id}`);
    }

    public getAll(search?: string): Observable<UserEntity[]> {
        const params =
            search == null ? null : new HttpParams().set('search', search);

        return this._http.get<UserEntity[]>(this._path, {
            params,
        });
    }

    public update(data: UserRequest): Observable<UserEntity> {
        return this._http.put<UserEntity>(`${this._path}/${data.id}`, data);
    }
}