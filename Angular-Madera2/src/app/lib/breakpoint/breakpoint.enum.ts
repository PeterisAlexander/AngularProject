/**
 * Recensement des breakpoints utilisé par le module @angular/flex-layout
 * https://github.com/angular/flex-layout/wiki/Responsive-API#mediaqueries-and-aliases
 */
export enum BreakpointEnum {
    xs = 'screen and (max-width: 599px)',
    sm = 'screen and (min-width: 600px) and (max-width: 959px)',
    md = 'screen and (min-width: 960px) and (max-width: 1279px)',
    lg = 'screen and (min-width: 1280px) and (max-width: 1919px)',
    xl = 'screen and (min-width: 1920px) and (max-width: 5000px)',
    ltSm = 'screen and (max-width: 599px)',
    ltMd = 'screen and (max-width: 959px)',
    ltLg = 'screen and (max-width: 1279px)',
    ltXl = 'screen and (max-width: 1919px)',
    gtXs = 'screen and (min-width: 600px)',
    gtSm = 'screen and (min-width: 960px)',
    gtMd = 'screen and (min-width: 1280px)',
    gtLg = 'screen and (min-width: 1920px)'
}
