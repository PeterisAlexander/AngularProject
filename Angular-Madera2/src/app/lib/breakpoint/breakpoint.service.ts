import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BreakpointEnum } from './breakpoint.enum';
import { camelCase } from 'lodash';

export interface BreakpointWithValueModel {
    breakpoint: string;
    mediaQuery: string;
    value: string;
}

@Injectable()
export class BreakpointService {
    public constructor(private _breakpointObserver: BreakpointObserver) {}

    public observe(breakpoint: string | string[]): Observable<BreakpointState> {
        return this._breakpointObserver.observe(breakpoint);
    }

    /**
     * Permet de spécifier une valeur pour chaque breakpoint demandé
     * (ex d'utilisation, le nombre de cartes affichées dans
     * la liste de cartes en fonction de la résolution)
     *
     * breakpoints est une chaine qui accepte autant les breapoints du cdk que la syntaxe css :
     * - md = 1, gt-md = 2
     * - (min-width: 768px) and (max-width: 959px) = 1, (min-width: 960px) = 2
     * - md = 1, (min-width: 960px) = 2
     */
    public valueFromBreakpoints(
        breakpoints: string
    ): Observable<BreakpointWithValueModel> {
        const breakpointList: BreakpointWithValueModel[] = breakpoints
            .split(',')
            .map(token => {
                const [breakpoint, value] = token.split('=').map(i => i.trim());

                const breakpointFormalized = camelCase(breakpoint);

                return {
                    breakpoint,
                    mediaQuery:
                        BreakpointEnum[breakpointFormalized] == null
                            ? breakpoint
                            : BreakpointEnum[camelCase(breakpointFormalized)],
                    value
                };
            });

        return this._breakpointObserver
            .observe(breakpointList.map(b => b.mediaQuery))
            .pipe(
                filter(e => e.matches),
                map(e => breakpointList.find(b => e.breakpoints[b.mediaQuery])),
                shareReplay(1)
            );
    }
}
