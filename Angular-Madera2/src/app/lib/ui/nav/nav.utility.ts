import { chain, escapeRegExp, isString } from 'lodash';
import { addSlash } from '../../utility/string';
import { NavItemModel } from './nav-item.model';

export function isRouteEqualUrl(
    navItem: NavItemModel,
    url: string,
    onlyStartWith = false
): boolean {
    const routePath =
        navItem.routePattern == null
            ? navItem.route.path
            : navItem.routePattern;

    // il est nécessaire d'ajouter un slash en fin des urls car lorsque 2 routes
    // commencent pareil (ex: /compte et /compte-utilisateur)cela permet de
    // les différencier même lorsque le mode onlyStartWith est activé
    url = addSlash(url);

    const segments = addSlash(
        chain<string>(isString(routePath) ? [routePath] : routePath)
            .map((s) => s.split('/'))
            .flatten()
            .map((s) =>
                s.toString().startsWith(':') ? '(\\d|\\w)+' : escapeRegExp(s)
            )
            .join('\\/')
            .value()
    );

    return new RegExp(`^${segments}${onlyStartWith ? '' : '$'}`).test(url);
}
