import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    ScheduleModule,
    AgendaService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
} from '@syncfusion/ej2-angular-schedule';
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/fr/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr/timeZoneNames.json';
import { locales as calendarLocales } from './calendar/locale/locale';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { CalendarMonthComponent } from './calendar/calendar-month/calendar-month.component';
import { CalendarMultiMonthComponent } from './calendar/calendar-multi-month/calendar-multi-month.component';
import { EventFormComponent } from './calendar/event-form/event-form.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { HighlightPipe } from './highlight/highlight.pipe';
import { LineComponent } from './line/line.component';
import { FlagComponent } from './flag/flag.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { EditorComponent } from './editor/editor.component';
import { EditorContentComponent } from './editor-content/editor-content.component';
import { AvatarPickerComponent } from './avatar-picker/avatar-picker.component';
import { FilepickerComponent } from './filepicker/filepicker.component';
import { ColorPickerPanelComponent } from './color-picker-panel/color-picker-panel.component';
import { PersonInteractionComponent } from './person-interaction/person-interaction.component';
import { CurrencyPipe } from './currency/currency.pipe';
import { NumberPipe } from './number/number.pipe';
import { PercentPipe } from './percent/percent.pipe';
import { TimePipe } from './time/time.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TileComponent } from './tile/tile.component';
import { TileListComponent } from './tile-list/tile-list.component';
import { ContentComponent } from './layout/content/content.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { AvatarUrlPipe } from 'src/app/lib/ui/avatar-initiale/avatar-url.pipe';
import { AvatarInitialePipe } from './avatar-url/avatar-initiale.pipe';
import { ListViewerComponent } from './list-viewer/list-viewer.component';
import { HighlightSearchPipe } from './highlight/highlight-search/highlight-search.pipe';
import { ShortListComponent } from './short-list/short-list.component';
import { StatisticBarComponent } from './statistic-bar/statistic-bar.component';
import { StatisticFilterDirective } from './statistic-filter/statistic-filter.directive';
import { IconInteractionPipe } from './person-interaction/icon-interaction.pipe';
import { TitleInteractionPipe } from './person-interaction/title-interaction.pipe';
import { CardStatusComponent } from './card-status/card-status.component';
import { SortPipe } from './sort/sort.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TabsetDirective } from './tab/tabset.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DraggableTreeItemDirective } from './drag-and-drop/drop-tree/draggable-tree-item.directive';
import { DropTreeDirective } from './drag-and-drop/drop-tree/drop-tree.directive';
import { DropzoneTreeItemDirective } from './drag-and-drop/drop-tree/dropzone-tree-item.directive';
import { ToValidateStatusPipe } from './to-validate-status/to-validate-status.pipe';
import { BoxComponent } from './box/box.component';
import { TitleComponent } from './title/title.component';
import { SortFnPipe } from './sort/sort-fn.pipe';
import { PickerFormatDirective } from './picker-format/picker-format.directive';
import { SelectLoaderDirective } from './select/select-loader/select-loader.directive';
import { OptionContentComponent } from './select/option-content/option-content.component';
import { RotateContentDirective } from './rotate-content/rotate-content.directive';
import { StepActionBarComponent } from './step-action-bar/step-action-bar.component';
import { NavComponent } from './nav/nav.component';
import { CardComponent } from './card/card/card.component';
import { CardCellComponent } from './card/card-cell/card-cell.component';
import { PageContentComponent } from './page/page-content/page-content.component';
import { CardFooterComponent } from './card/card-footer/card-footer.component';
import { CardFooterItemComponent } from './card/card-footer-item/card-footer-item.component';
import { CardListComponent as NewCardListComponent } from './card/card-list/card-list.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageLabelComponent } from './page-label/page-label.component';
import { ListComponent } from './list/list/list.component';
import { ListHeaderComponent } from './list/list-header/list-header.component';
import { ListHeaderCellComponent } from './list/list-header-cell/list-header-cell.component';
import { ListFilterComponent } from './list-filter/list-filter.component';
import { LegendeComponent } from './legende/legende.component';
import { PageLabelService } from './page-label/page-label.service';
import { ListAddComponent } from './list/list-add/list-add.component';
import { ListAddService } from './list/list-add/list-add.service';
import { FormGroupComponent } from './form/form-group/form-group.component';
import { SubNavComponent } from './sub-nav/sub-nav.component';
import { SubNavItemComponent } from './sub-nav-item/sub-nav-item.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { ListDropzoneComponent } from './list/list-dropzone/list-dropzone.component';
import { CardDragHandleComponent } from './card/card-drag-handle/card-drag-handle.component';
import { OptionLoadingComponent } from './select/option-loading/option-loading.component';
import { ZorroModule } from 'src/app/zorro/zorro.module';
import { RangeDateLabelPipe } from './range-date-label/range-date-label.pipe';
import { MergeFieldService } from './merge-field/merge-field.service';
import { MergeFieldInputDirective } from './merge-field/merge-field-input.directive';
import { NoDataPipe } from './no-data/pipe/no-data.pipe';
import { NoDataDirective } from './no-data/directive/no-data.directive';
import { ButtonLinkGroupComponent } from './button-link-group/button-link-group.component';
import { HeaderComponent } from './layout/header/header.component';
import { HeaderBookmarkListComponent } from './layout/header-bookmark-list/header-bookmark-list.component';
import { HeaderUserComponent } from './layout/header-user/header-user.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { CollapsableComponent } from './collapse/collapsable/collapsable.component';
import { CollapsableHeaderComponent } from './collapse/collapsable-header/collapsable-header.component';

/**
 * Liste des composants présents dans la bibliothèque.
 */
const components = [
    AvatarInitialePipe,
    AvatarPickerComponent,
    AvatarUrlPipe,
    ActionBarComponent,
    BoxComponent,
    BreadcrumbComponent,
    ButtonLinkGroupComponent,
    CalendarComponent,
    CalendarMonthComponent,
    CalendarMultiMonthComponent,
    CardComponent,
    CardCellComponent,
    CardDragHandleComponent,
    CardFooterComponent,
    CardFooterItemComponent,
    CardStatusComponent,
    CollapsableComponent,
    CollapsableHeaderComponent,
    ColorPickerComponent,
    ColorPickerPanelComponent,
    ContentComponent,
    CurrencyPipe,
    DraggableTreeItemDirective,
    DropTreeDirective,
    DropzoneTreeItemDirective,
    HeaderComponent,
    HeaderBookmarkListComponent,
    HeaderUserComponent,
    HighlightPipe,
    HighlightSearchPipe,
    EditorComponent,
    EditorContentComponent,
    EventFormComponent,
    FilepickerComponent,
    FlagComponent,
    FormGroupComponent,
    IconInteractionPipe,
    InfiniteScrollComponent,
    InputErrorComponent,
    LayoutComponent,
    LegendeComponent,
    LineComponent,
    ListAddComponent,
    ListComponent,
    ListDropzoneComponent,
    ListHeaderComponent,
    ListHeaderCellComponent,
    ListFilterComponent,
    ListViewerComponent,
    MergeFieldInputDirective,
    NavComponent,
    NewCardListComponent,
    NoDataDirective,
    NoDataPipe,
    NumberPipe,
    OptionContentComponent,
    OptionLoadingComponent,
    PageContentComponent,
    PageHeaderComponent,
    PageLabelComponent,
    PercentPipe,
    PersonInteractionComponent,
    PickerFormatDirective,
    RangeDateLabelPipe,
    RotateContentDirective,
    ShortListComponent,
    SelectLoaderDirective,
    SortFnPipe,
    SortPipe,
    StatisticBarComponent,
    StatisticFilterDirective,
    StepActionBarComponent,
    SubNavComponent,
    SubNavItemComponent,
    TabsetDirective,
    TileComponent,
    TitleComponent,
    TitleInteractionPipe,
    TileListComponent,
    TimePipe,
    ToValidateStatusPipe,
];

loadCldr(
    numberingSystems['default'],
    gregorian['default'],
    numbers['default'],
    timeZoneNames['default']
);

L10n.load(calendarLocales);

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        OverlayModule,
        ImageCropperModule,
        PortalModule,
        QuillModule.forRoot(),
        RouterModule,
        FlexLayoutModule,
        ScheduleModule,
        ReactiveFormsModule,
        ZorroModule,
    ],
    providers: [
        AgendaService,
        AvatarInitialePipe,
        AvatarUrlPipe,
        DayService,
        IconInteractionPipe,
        ListAddService,
        MergeFieldService,
        MonthService,
        NoDataPipe,
        NumberPipe,
        PageLabelService,
        PickerFormatDirective,
        RangeDateLabelPipe,
        SortPipe,
        TitleInteractionPipe,
        TimePipe,
        ToValidateStatusPipe,
        WeekService,
        WorkWeekService,
    ],
})
export class UIModule {}
