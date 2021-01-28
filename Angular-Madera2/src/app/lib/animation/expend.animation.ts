import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';

export const EXPEND_ANIMATION_DURATION = 225;

/**
 * Animation d'ouverture/fermeture verticale basée sur le bodyExpension de material :
 * https://github.com/angular/components/blob/master/src/material/expansion/expansion-animations.ts
 *
 * Cette version permet :
 * - de ne pas utiliser material juste pour une animation
 * - de simplifier l'utilisation : l'état est basé sur un boolean au lieu de 2 chaines (expanded/collapsed)
 */
export const expendAnimation = trigger('expend', [
    state('false, void', style({ height: '0', visibility: 'hidden' })),
    state('true', style({ height: '*', visibility: 'visible' })),
    transition(
        'true <=> false, void => false',
        animate(`${EXPEND_ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`)
    ),
]);
