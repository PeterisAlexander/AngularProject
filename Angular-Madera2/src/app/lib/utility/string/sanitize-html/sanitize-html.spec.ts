import { sanitizeHtml } from './sanitize-html';

describe('sanitize-html', () => {
    it(`retire les balises html et les attributs non autorisés`, () => {
        const str =
            '<p>Mon paragrahe</p><span style="color:red">Mon span</span><script>Mon script</script>';

        expect(sanitizeHtml(str)).toEqual(
            '<p>Mon paragrahe</p><span style="color:red">Mon span</span>'
        );
    });
});
