import { Injectable } from '@angular/core';

@Injectable()
export class BrowserLocationService {
    /**
     * Retourne l'origine de l'url courante (ex: protocol://sousdomaine.domaine)
     */
    public getOrigin(): string {
        return window.location.origin;
    }

    /**
     * Ouvre dans une nouvelle fenêtre l'url passée en paramètre
     */
    public open(url: string, ...params: string[]): void {
        url = this.prepareUrl(url);

        if (url == null) {
            return;
        }

        window.open(url, '_blank', params.join(','));
    }

    public prepareUrl(url: string): string {
        url = url.trim();

        if (url === '') {
            return null;
        }

        return /(https?:\/\/|mailto:).+/i.test(url) ? url : `http://${url}`;
    }

    public redirect(url: string): void {
        url = this.prepareUrl(url);

        if (url == null) {
            return;
        }

        window.location.href = url;
    }
}
