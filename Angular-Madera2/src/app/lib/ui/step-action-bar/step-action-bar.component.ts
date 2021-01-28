import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-step-action-bar',
    templateUrl: './step-action-bar.component.html',
    styleUrls: ['./step-action-bar.component.css']
})
export class StepActionBarComponent {
    @Input()
    public isNextHidden = true;

    @Input()
    public isPreviousHidden = true;

    @Input()
    public isSubmitHidden = true;

    @Output()
    public next = new EventEmitter<void>();

    @Output()
    public previous = new EventEmitter<void>();

    @Output()
    public submit = new EventEmitter<void>();

    @Input()
    public submitText = 'Valider';

    @Input()
    public width: string;
}
