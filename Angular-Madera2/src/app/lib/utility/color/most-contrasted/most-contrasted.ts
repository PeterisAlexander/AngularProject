import Color from 'color';

/**
 * Retourne la couleur passée en paramètre qui est la plus contrastée par rapport
 * à la couleur de référence celon le WCAG (https://www.w3.org/TR/WCAG20/#contrast-ratiodef)
 */
export function mostContrasted(reference: string, ...colors: string[]): string {
    const referenceColor = new Color(reference);
    const contrastColors = colors.map(current => {
        return new Color(current).contrast(referenceColor);
    });
    const maxContrast = Math.max(...contrastColors);
    const maxContrastIndex = contrastColors.indexOf(maxContrast);

    return colors[maxContrastIndex];
}
