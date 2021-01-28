import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { MockRequest } from './mock-request';

/**
 * Intercepte les requêtes ajax pour simuler le retour d'un serveur
 */
@Injectable()
export class MockRequestInterceptor implements HttpInterceptor {
    public constructor(
        /**
         * Service permettant de simuler une requête
         */
        private _mockRequestService: MockRequest
    ) {}

    /**
     * Intercepte la requête et renvoie la réponse simulée si elle est définie,
     * Sinon la requête initiale est exécutée
     */
    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const endPoint = this._mockRequestService.getEndPoint(
            req.method,
            req.url
        );

        if (endPoint == null) {
            return next.handle(req);
        }

        const request = new Observable<HttpEvent<any>>((observer) => {
            const event = new HttpResponse<any>({
                body: endPoint(req.body),
                headers: req.headers,
                status: 200,
                statusText: 'OK',
                url: req.urlWithParams,
            });

            observer.next(event);
            observer.complete();
        });

        return (
            request
                // du delais pour simuler le temps d'exécution de la requête http
                .pipe(delay(500))
        );
    }
}
