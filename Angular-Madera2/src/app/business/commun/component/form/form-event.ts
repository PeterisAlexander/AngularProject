import { EventEmitter } from '@angular/core';

/**
 * Définit les événements accessibles sur un formulaire
 */
export interface FormEvent {
    /**
     * Evénement déclenché lorsque la ressource a été archivée
     */
    archive: EventEmitter<any>;

    /**
     * Evénement déclenché lors de l'annulation
     */
    cancel: EventEmitter<void>;

    /**
     * Evénement déclenché lors de la complétion d'une action sur la ressource
     * (submit, archive, delete)
     */
    complete: EventEmitter<any>;

    /**
     * Evénement déclenché lorsque la ressource a été supprimée
     */
    delete: EventEmitter<any>;

    /**
     * Evénement déclenché lorsque la ressource a été enregistrée
     */
    save: EventEmitter<any>;
}
