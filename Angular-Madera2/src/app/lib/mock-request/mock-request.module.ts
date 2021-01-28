import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MockRequest } from './mock-request';
import { MockRequestInterceptor } from './mock-request-interceptor';

/**
 * Fournit un outil pour mocker les réponses de requêtes Ajax.
 * Le module se charge uniquement dans le AppModule via la méthode forRoot.
 */
@NgModule({
    providers: [MockRequestInterceptor],
})
export class MockRequestModule {
    /**
     * Module à charger uniquement dans le AppModule
     */
    public static forRoot(
        MockRequestService: Type<MockRequest>
    ): ModuleWithProviders<MockRequestModule> {
        return {
            ngModule: MockRequestModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MockRequestInterceptor,
                    multi: true,
                },
                { provide: MockRequest, useClass: MockRequestService },
            ],
        };
    }
}
