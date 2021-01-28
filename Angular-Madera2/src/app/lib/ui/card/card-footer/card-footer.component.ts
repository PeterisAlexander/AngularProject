import {
    Component,
    TemplateRef,
    ViewChild,
    ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'app-card-footer',
    templateUrl: './card-footer.component.html',
    styleUrls: ['./card-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFooterComponent {
    @ViewChild(TemplateRef)
    public template: TemplateRef<void>;
}
