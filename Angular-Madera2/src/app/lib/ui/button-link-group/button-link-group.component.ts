import {
    AfterViewInit,
    Component,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive } from '@angular/router';
import { NzRadioButtonDirective } from 'ng-zorro-antd/radio';
import { merge, of } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { RouteModel } from '../../model/route.model';

export interface ButtonLinkModel {
    label: string;
    route: RouteModel;
}

@Component({
    selector: 'app-button-link-group',
    templateUrl: './button-link-group.component.html',
    styleUrls: ['./button-link-group.component.css'],
})
export class ButtonLinkGroupComponent implements AfterViewInit {
    public activeLink: ButtonLinkModel;

    @Input()
    public links: ButtonLinkModel[] = [];

    private get _routerLinkActive(): RouterLinkActive {
        return this._routerLinks.find((l) => l.isActive);
    }

    @ViewChildren(NzRadioButtonDirective, { read: RouterLinkActive })
    private _routerLinks: QueryList<RouterLinkActive>;

    public constructor(private _router: Router) {}

    public ngAfterViewInit(): void {
        this.addListeners();
    }

    private addListeners(): void {
        merge(
            of(null),
            this._router.events.pipe(filter((e) => e instanceof NavigationEnd)),
            this._routerLinks.changes
        )
            // Outre son intérêt principal, le debounceTime sert aussi dans un autre cas :
            // à l'initialisation des RouterLinkActive, leur propriété isActive n'est pas définie encore avec la bonne valeur,
            // du coup on ne retrouve pas le lien actif, le fait de rajouter un délais permet de passer outre ce problème.
            .pipe(debounceTime(50))
            .subscribe(() => this.setActivateLink());
    }

    private setActivateLink(): void {
        const indexActive = this._routerLinks
            .toArray()
            .indexOf(this._routerLinkActive);

        this.activeLink = this.links[indexActive];
    }
}
