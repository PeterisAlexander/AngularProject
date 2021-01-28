import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, of, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BreadcrumbItemModel } from './breadcrumb-item.model';
import { truncate } from 'lodash';

const LABEL_MAX_LENGTH = 75;

@Component({
    selector: 'app-breadcrumb',
    styleUrls: ['./breadcrumb.component.css'],
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
    public items: Observable<BreadcrumbItemModel[]>;

    public constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {}

    public getEllipsisLabel(label: string): string {
        return label.length > LABEL_MAX_LENGTH
            ? truncate(label, { length: LABEL_MAX_LENGTH })
            : label;
    }

    public ngOnInit(): void {
        this.items = merge(
            of(null), // récupération des items intiaux
            this._router.events.pipe(filter((e) => e instanceof NavigationEnd))
        ).pipe(map(() => this.getItems(this._activatedRoute.root)));
    }

    private getItems(
        route: ActivatedRoute,
        baseUrl = ''
    ): BreadcrumbItemModel[] {
        const child = route.children.find((r) => r.outlet === 'primary');

        if (child == null || child.routeConfig.path === '') {
            // égale à la route parente, donc déjà ajoutée
            return [];
        }

        if (child.snapshot.data.breadcrumb == null) {
            return this.getItems(
                child,
                `${baseUrl}/${child.snapshot.url.map((s) => s.path).join('/')}`
            );
        }

        const item = {
            label:
                child.snapshot.data.breadcrumb instanceof Function
                    ? child.snapshot.data.breadcrumb(child.snapshot.data)
                    : child.snapshot.data.breadcrumb,
            link: `${baseUrl}/${child.snapshot.url
                .map((s) => s.path)
                .join('/')}`,
        };

        return [item, ...this.getItems(child, item.link)];
    }
}
