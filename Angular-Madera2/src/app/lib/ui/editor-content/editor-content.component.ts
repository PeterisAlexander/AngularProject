import { Component, Input, HostBinding } from '@angular/core';

import { sanitizeHtml } from '../../utility/string/sanitize-html/sanitize-html';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';

/**
 * Composant permettant d'afficher de l'HTML écrit via le composant Editor
 */
@Component({
    selector: 'app-editor-content',
    templateUrl: './editor-content.component.html',
    styleUrls: ['./editor-content.component.css']
})
export class EditorContentComponent implements HandlePropertyChange {
    @Input()
    @ListenPropertyChange()
    public content = '';

    @HostBinding('class.editorContent-empty')
    public get isEmpty(): boolean {
        return this.content == null || this.content === '';
    }

    /**
     * Contenu à afficher
     */
    public safeContent = '';

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (
            changes.content &&
            changes.content.previousValue !== changes.content.currentValue
        ) {
            this.safeContent = sanitizeHtml(this.content);
        }
    }
}
