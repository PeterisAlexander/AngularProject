import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusinessAPI } from '../api/business/business.api';
import { UserEntity } from '../entity/user/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserEntity> {
  public constructor(private api: BusinessAPI, private _router: Router) {}

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserEntity> {
        return this.api.user.get(route.params.idUser).pipe(
            catchError(() => {
                this._router.navigate(['/user']);
                return of(null);
            })
        );
    }
}
