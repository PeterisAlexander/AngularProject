import { RouteModel } from 'src/app/lib/model/route.model';

export interface HeaderBookmarkListItemModel {
    label: string;
    route: RouteModel;
}

export type HeaderBookmarkListModel = HeaderBookmarkListItemModel[];
