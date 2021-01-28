import { isEmpty } from 'lodash';
import Quill from 'quill';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ListLoaderFinite } from 'src/app/lib/list-loader/loader/list-loader-finite';
import { MergeFieldBlot, MERGE_FIELD_BLOT_NAME } from './merge-field';

const TextBlot = Quill.import('blots/text');

const searchRegex = /\{\{ *([\w\d\.]*) *(\}\})? */i;

const stopSearchRegex = /\{\{ *[\w\d\.]+[^\w\d\.]+/i;

export enum SuggestionNavigationEnum {
    prev = -1,
    select = 0,
    next = 1,
}

export interface SuggestionPositionModel {
    left: number;
    show: boolean;
    top: number;
}

export interface SuggestionModel<Extra = any> {
    active: boolean;
    extra: Extra;
    key: string;
}

export interface TemplateOptionsModel<T = any> {
    listLoader: ListLoaderFinite<T, SuggestionModel<T>>;
}

Quill.register(MergeFieldBlot);

export class Template {
    public navigate = new Subject<SuggestionNavigationEnum>();

    public suggestion = new BehaviorSubject<SuggestionPositionModel>({
        show: false,
        left: 0,
        top: 0,
    });

    private _destroy = new Subject<void>();

    private _listLoader: ListLoaderFinite<SuggestionModel>;

    private _suggest = new Subject<void>();

    public constructor(private _editor: Quill, options: TemplateOptionsModel) {
        if (!options.listLoader) {
            throw new Error('list Loader de champs de fusions manquant');
        }

        this._listLoader = options.listLoader;

        this.initNavigationListening();

        this.initBindings();
    }

    public autocompleteSelected(mergeField: SuggestionModel): void {
        const range = this._editor.getSelection(true);
        const [leaf, cursorIndexInLeaf] = this._editor.getLeaf(range.index);

        if (!(leaf instanceof TextBlot)) {
            return;
        }

        const textBeforeCursor = leaf.text.substring(0, cursorIndexInLeaf);
        const lastDelimiterIndex = textBeforeCursor.lastIndexOf('{{') || 0;
        const textToSearch = leaf.text.substring(
            lastDelimiterIndex,
            leaf.text.length
        );
        const match = textToSearch?.match(searchRegex);

        if (match) {
            const start = range.index - cursorIndexInLeaf + lastDelimiterIndex;

            this._editor.deleteText(start, match[0].length);

            this.insertMergeField(mergeField.key, start);

            this.suggestion.next({
                show: false,
                left: 0,
                top: 0,
            });
        }
    }

    public destroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public insertMergeField(key: string, index: number = null): void {
        const range = this._editor.getSelection(true);

        const start = index || range.index;

        this._editor.insertEmbed(start, MERGE_FIELD_BLOT_NAME, key);
        // espace pour permettre le clic entre plusieurs champs de fusions sur firefox
        this._editor.insertText(start + 1, ' ', 'user');
        this._editor.setSelection(start + 2, 0);
    }

    private handleSuggest(): void {
        const range = this._editor.getSelection(true);
        const [leaf, cursorIndexInLeaf] = this._editor.getLeaf(range.index);

        if (!(leaf instanceof TextBlot)) {
            return;
        }

        const textBeforeCursor = leaf.text.substring(0, cursorIndexInLeaf);
        let lastDelimiterIndex = textBeforeCursor.lastIndexOf('{{');
        lastDelimiterIndex = lastDelimiterIndex < 0 ? 0 : lastDelimiterIndex;

        const searchMatch = leaf.text
            .substring(lastDelimiterIndex, leaf.text.length)
            .match(searchRegex);

        const stopSearchMatch = leaf.text
            .substring(lastDelimiterIndex, cursorIndexInLeaf)
            .match(stopSearchRegex);

        if (stopSearchMatch || !searchMatch) {
            this.suggestion.next({
                show: false,
                left: 0,
                top: 0,
            });
        } else if (searchMatch) {
            const start = range.index - cursorIndexInLeaf + lastDelimiterIndex;
            const bounds = this._editor.getBounds(start);
            this.suggestion.next({
                show: cursorIndexInLeaf > searchMatch.index,
                left: bounds.left,
                top: bounds.bottom,
            });
            this._listLoader.search(searchMatch[1]);
        }
    }

    private initBindings(): void {
        fromEvent(this._editor, 'selection-change')
            .pipe(
                takeUntil(this._destroy),
                filter(([range, oldRange, source]) => range != null)
            )
            .subscribe(() => this._suggest.next(null));

        fromEvent(this._editor.root, 'keyup')
            .pipe(takeUntil(this._destroy))
            .subscribe((event: KeyboardEvent) => {
                if (
                    event.defaultPrevented ||
                    ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)
                ) {
                    return;
                }
                this._suggest.next();
            });

        this._suggest
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.handleSuggest());
    }

    private initNavigationListening(): void {
        this._listLoader.data
            .pipe(
                takeUntil(this._destroy),
                switchMap((data) =>
                    this.navigate.pipe(map((navigate) => ({ data, navigate })))
                )
            )
            .subscribe(({ data, navigate }) => {
                if (isEmpty(data)) {
                    return;
                }

                if (navigate === 0) {
                    const active = data.find((e) => e.active);
                    this.autocompleteSelected(active);
                    return;
                }

                const activeIndex = data.findIndex((e) => e.active);

                let newActiveIndex = activeIndex + navigate;

                if (data.length === 0) {
                    return;
                }

                if (newActiveIndex < 0) {
                    newActiveIndex = data.length - 1;
                } else if (newActiveIndex > data.length - 1) {
                    newActiveIndex = 0;
                }

                data[activeIndex].active = false;
                data[newActiveIndex].active = true;
            });
    }
}
