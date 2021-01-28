import { NgModule } from '@angular/core';
import { UserStorageService } from './user-storage/user-storage.service';
import { BrowserLocationService } from './browser-location/browser-location.service';
import { UIModule } from './ui/ui.module';
import { ListLoaderService } from './list-loader/list-loader.service';
import { CustomFileService } from './custom-file/custom-file.service';
import { BreakpointService } from './breakpoint/breakpoint.service';

@NgModule({
    exports: [UIModule],
    imports: [UIModule],
    providers: [
        BreakpointService,
        BrowserLocationService,
        CustomFileService,
        ListLoaderService,
        UserStorageService
    ]
})
export class LibModule {}
