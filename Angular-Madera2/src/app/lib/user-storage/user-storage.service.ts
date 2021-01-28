import { Injectable } from '@angular/core';

/**
 * Espace de stockage de l'utilisateur (utilise le localStorage du navigateur)
 */
@Injectable()
export class UserStorageService {
    /**
     * Retourne la valeur correspondant à la clé
     */
    public get(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     * Assigne une valeur à la clé
     */
    public set(key: string, value: any): void {
        if (value == null) {
            this.remove(key);
            return;
        }

        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Retourne si une clé est présente dans l'espace de stockage
     */
    public has(key: string): boolean {
        return localStorage.getItem(key) != null;
    }

    /**
     * Supprime une clé dans l'espace de stockage
     */
    public remove(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Supprime toutes les clés de l'espace de stockage
     */
    public removeAll(): void {
        localStorage.clear();
    }
}
