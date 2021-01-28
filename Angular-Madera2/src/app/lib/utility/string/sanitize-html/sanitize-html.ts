import sanitizeHtmlPackage from 'sanitize-html';

import { ALLOWED_HTML_TAGS } from './allowed-html-tags';

export interface SanitizeHtmlOption {
    allowedAttributes?: { [markup: string]: string[] };
    allowedTags?: string[];
}

const defaultConf = {
    allowedTags: ALLOWED_HTML_TAGS,
    allowedAttributes: { span: ['style', 'class'], p: ['style'] },
};

export function sanitizeHtml(
    value: string,
    option: SanitizeHtmlOption = {}
): string {
    return sanitizeHtmlPackage(value, { ...defaultConf, ...option });
}
