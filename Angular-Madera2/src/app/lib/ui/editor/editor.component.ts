import {
    Component,
    Input,
    forwardRef,
    EventEmitter,
    Output,
    ElementRef,
    OnDestroy,
    TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import Quill from 'quill';

import { ChampFusionEntity } from 'src/app/core/entity/messagerie/champ-fusion.entity';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { EditorConfigModel } from './editor-config.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    SuggestionModel,
    SuggestionNavigationEnum,
    SuggestionPositionModel,
    Template,
    TemplateOptionsModel,
} from './template/template';
import { ListLoaderFinite } from '../../list-loader/loader/list-loader-finite';

export const defaultEditorConfig: EditorConfigModel = {
    bold: true,
    clean: true,
    colorBackgroundText: true,
    header: true,
    image: false,
    italic: true,
    listBullet: true,
    listOrdered: true,
    textAlign: true,
    textColor: true,
    textFont: false,
    textIndent: false,
    underline: true,
};

export interface QuillEditorCreatedModel {
    component: QuillEditorComponent;
    editor: Quill;
}

const Keyboard = Quill.import('modules/keyboard');

// utilisation des font de l'application
const font = Quill.import('formats/font');
font.whitelist = ['Open Sans'];
Quill.register(font, true);

Quill.register('modules/template', Template);

// utilisation de l'attribut style pour activer les styles plutôt que les classes .ql-*
['align', 'background', 'color', 'direction', 'font', 'size']
    .map((module) => Quill.import(`attributors/style/${module}`))
    .forEach((attributor) => Quill.register(attributor));

// L'utilisation de <p> pour gérer les retours à la ligne est très problématique notamment pour l'écriture d'email
// (les clients mails affichent différamment les <p> que Quill), on les remplaces donc par des <div>.
// Quill n'étant pas configurable là dessus, on créé un nouveau blot dont la seule différence sera la balise utilisée :
// https://github.com/quilljs/quill/issues/3065
const Block = Quill.import('blots/block');
class DivAsBlock extends Block {}
DivAsBlock.tagName = 'DIV';
Quill.register('blots/block', DivAsBlock, true);

@Component({
    selector: 'app-editor',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorComponent),
            multi: true,
        },
    ],
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
})
export class EditorComponent
    implements ControlValueAccessor, HandlePropertyChange, OnDestroy {
    public get isEmpty() {
        return this.value === '';
    }

    public get modules(): QuillModules {
        return {
            template: this.getTemplateConfig(),
            keyboard: {
                bindings: {
                    suggestionDown: {
                        key: Keyboard.keys.DOWN,
                        handler: this.sugestionNavigationBindingFactory(
                            SuggestionNavigationEnum.next
                        ),
                    },
                    suggestionUp: {
                        key: Keyboard.keys.UP,
                        handler: this.sugestionNavigationBindingFactory(
                            SuggestionNavigationEnum.prev
                        ),
                    },
                    suggestionEnter: {
                        key: Keyboard.keys.ENTER,
                        handler: this.sugestionNavigationBindingFactory(
                            SuggestionNavigationEnum.select
                        ),
                    },
                    // l'indentation via la touche tab est désactivée
                    // car elle est basée sur des classes et non pas sur du DOM (ex: imbrication de liste)
                    // en attendant de trouver une meilleurs solution, on bloque
                    indent: {
                        key: 'Tab',
                        format: ['blockquote', 'indent', 'list'],
                        handler: () => false,
                    },
                },
            },
        };
    }

    @Input()
    public autocompleteLoader: ListLoaderFinite<
        ChampFusionEntity,
        SuggestionModel<ChampFusionEntity>
    >;

    @Input()
    @ListenPropertyChange()
    public config: Partial<EditorConfigModel> = {};

    public configInternal: EditorConfigModel;

    @Input()
    @ListenPropertyChange()
    public disabled = false;

    @Output()
    public editorCreated = new EventEmitter<QuillEditorCreatedModel>();

    public editorStyle = {
        borderRadius: '0 0 4px 4px',
        height: 'auto',
    };

    @Input()
    public extra: TemplateRef<void>;

    @Input()
    @ListenPropertyChange()
    public height = 'auto';

    public showSugestions = new BehaviorSubject<SuggestionPositionModel>({
        show: false,
        left: 0,
        top: 0,
    });

    @Input()
    @ListenPropertyChange()
    public value = '';

    private _destroy = new Subject<void>();

    private _editor: Quill;

    public constructor(private _elementRef: ElementRef) {}

    public autocomplete(suggest: SuggestionModel<ChampFusionEntity>): void {
        (this._editor.getModule('template') as Template).autocompleteSelected(
            suggest
        );
    }

    public changeValue(val: string): void {
        this.value = val;

        this.onChange(this.value);
    }

    public focus(): void {
        if (this.disabled) {
            return;
        }

        this._editor.setSelection(this._editor.getLength(), 0);
    }

    public getTemplateConfig(): TemplateOptionsModel {
        if (!this.autocompleteLoader) {
            return null;
        }

        return {
            listLoader: this.autocompleteLoader,
        };
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.config) {
            this.handleConfigChange();
        }

        if (changes.disabled) {
            this.handleDisabledChange();
        }

        if (changes.height) {
            this.handleHeightChange();
        }

        if (changes.value) {
            this.handleValueChange();
        }
    }

    public ngOnDestroy(): void {
        const templateModule: Template = this._editor.getModule('template');

        templateModule?.destroy();
        this._destroy.next();
        this._destroy.complete();
    }

    public onChange = (value: string) => {};

    public onTouched = () => {};

    public quillEditorCreated(
        editor: Quill,
        quillEditor: QuillEditorComponent
    ): void {
        this._editor = editor;
        this.initSuggestionListener();
        this.editorCreated.next({
            component: quillEditor,
            editor,
        });
    }

    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public trackMergeField(index: number, item: ChampFusionEntity): string {
        return item.description;
    }

    public updateSuggestionShow(show: boolean): void {
        this.showSugestions.next({
            ...this.showSugestions.value,
            show: show,
        });
    }

    public writeValue(val: string): void {
        this.value = val;
    }

    private handleConfigChange(): void {
        this.configInternal = {
            ...defaultEditorConfig,
            ...this.config,
        };
    }

    private handleDisabledChange(): void {
        if (this._editor) {
            this._editor.enable(!this.disabled);
        }
    }

    private handleHeightChange(): void {
        this.editorStyle = {
            ...this.editorStyle,
            height: this.height,
        };
    }

    private handleValueChange(): void {
        if (this.value == null) {
            this.value = '';
        }
    }

    private initSuggestionListener(): void {
        const templateModule: Template = this._editor.getModule('template');

        if (templateModule?.suggestion == null) {
            return;
        }

        templateModule.suggestion
            .pipe(takeUntil(this._destroy))
            .subscribe((suggest) => {
                const rect = this._elementRef.nativeElement
                    .querySelector('.ql-editor')
                    .getBoundingClientRect();

                this.showSugestions.next({
                    show: suggest.show,
                    left: suggest.left + rect.left,
                    top: suggest.top + rect.top,
                });
            });
    }

    private sugestionNavigationBindingFactory(
        navigation: SuggestionNavigationEnum
    ): () => void | true {
        return () => {
            if (this.showSugestions.value.show) {
                const templateModule: Template = this._editor.getModule(
                    'template'
                );

                if (templateModule) {
                    templateModule.navigate.next(navigation);
                }
            } else {
                return true;
            }
        };
    }
}
