import { EventEmitter } from '@angular/core';
import { ChangeModel } from './change.model';
import { HandlePropertyChange } from './handle-property-change';
import { isFunction } from 'lodash';

const INTERNAL_PREFIX = '__listenPropertyChange';
const TIMER_PROP_NAME = `${INTERNAL_PREFIX}GroupedChangesTimer`;
const CURRENT_CHANGES_PROP_NAME = `${INTERNAL_PREFIX}CurrentChanges`;
const VALUE_PROP_PREFIX = `${INTERNAL_PREFIX}Prop_`;
const OUTPUT_PROP_SUFFIX = 'Change';

/**
 * Surveille la propriété sur laquelle est positionné le décorateur et
 * lors des changements de valeurs :
 * - déclenche automatiquement l'EventEmiter pour le data binding à double sens
 * - déclenche la méthode handlePropertyChange() requise par l'interface HandlePropertyChange
 *   (équivalent au ngOnChanges d'angular)
 */
export function ListenPropertyChange() {
    return function(target: any, propName: string): void {
        const internalValuePropName = `${VALUE_PROP_PREFIX}${propName}`;

        Object.defineProperty(target, propName, {
            get: function(): any {
                return this[internalValuePropName];
            },
            set: function(value: any) {
                if (this[internalValuePropName] !== value) {
                    setValue(this, propName, {
                        currentValue: value,
                        previousValue: this[internalValuePropName]
                    });
                }
            }
        });
    };
}

function setValue(
    instance: HandlePropertyChange,
    propName: string,
    change: ChangeModel
): void {
    const internalValuePropName = `${VALUE_PROP_PREFIX}${propName}`;
    const outputProp = instance[`${propName}${OUTPUT_PROP_SUFFIX}`];

    instance[internalValuePropName] = change.currentValue;

    if (outputProp instanceof EventEmitter) {
        outputProp.emit(change.currentValue);
    }

    const previousChange = (instance[CURRENT_CHANGES_PROP_NAME] || {})[
        propName
    ];

    instance[CURRENT_CHANGES_PROP_NAME] = {
        ...(instance[CURRENT_CHANGES_PROP_NAME] || {}),
        [propName]: {
            ...change,
            // la valeur précédente que l'on retrouve dans le handlePropertyChange
            // est la valeur de la propriété avant le 1er changement détecté avant déclenchement
            // du handlePropertyChange, cela permet de pouvoir comparer la 1ère valeur (previousValue)
            // à la dernière valeur poussée (currentValue) et non pas les 2 dernières valeurs poussées
            previousValue:
                previousChange == null
                    ? change.previousValue
                    : previousChange.previousValue
        }
    };

    /*
     * Les changements sont regroupés en pack de modifications
     * pour proposer une méthode similaire au ngOnChanges() d'Angular.
     *
     * Cela pourrait être fait via un Subject et un debounceTime
     * mais comme on ne travail pas spécifiquement avec des composants
     * et des services, on n'a pas toujours accès à ngOnDestroy(),
     * par conséquent il est difficile de se désabonner du Subject,
     * donc à l'ancienne avec un setTimeout.
     *
     * Concernant la duré de 5ms, elle est basée sur le fait que
     * ngOnChanges se déclenche "en moyenne" 1ms après le changement de valeur
     * mais comme Angular ne gère surement pas en interne cela avec un setTimeout,
     * on se prévoit un peu de marge si le code exécuté ralenti pour une raison
     * ou une autre (machine peu performante, etc).
     *
     * Il est à noter que l'exécution handlePropertyChange() déclenche un
     * ngAfterViewChecked() supplémentaire :
     *
     * avec ngOnChanges :
     * - changement de valeur
     * - ngOnChanges()
     * - ngAfterViewChecked()
     *
     * avec handlePropertyChange :
     * - changement de valeur
     * - ngAfterViewChecked()
     * - handlePropertyChange()
     * - ngAfterViewChecked()
     *
     * Cela ne devrait pas poser de soucis de performance,
     * mais on ne sait jamais, c'est à garder en tête. */
    if (instance[TIMER_PROP_NAME]) {
        clearTimeout(instance[TIMER_PROP_NAME]);
    }

    instance[TIMER_PROP_NAME] = setTimeout(() => {
        const changes = instance[CURRENT_CHANGES_PROP_NAME];

        // il faut reseter les changements avant d'appeler le handlePropertyChange
        // sinon si ce dernier déclenche d'autres changements ils seront supprimés
        // en même temps que le reset
        instance[CURRENT_CHANGES_PROP_NAME] = {};

        if (isFunction(instance.handlePropertyChange)) {
            instance.handlePropertyChange(changes);
        }
    }, 5);
}
