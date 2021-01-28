import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BookmarkModel {
    canBookmark: boolean;
    isBookmarked: boolean;
    data: any;
}

@Injectable()
export class PageLabelService {
    public bookmark: Observable<BookmarkModel>;

    public toggleBookmark(isBookmarked: boolean, data: any): void {}
}
