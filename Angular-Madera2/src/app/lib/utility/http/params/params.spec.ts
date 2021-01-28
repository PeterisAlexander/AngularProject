import { HttpParams } from '@angular/common/http';
import { toDateApi } from 'src/app/core/utility/date/date.utility';
import { toHttpParams } from './params';

enum TestEnum {
    test1,
    test2,
    test3,
}

describe('toHttpParams', () => {
    it("doit retourner un objet httpParams, avec en paramètre un objet contenant une date, un tableau d'id, un tableau d'enum, une chaîne, une chaîne vide, un boolean, une valeur null et une valeur undefined", () => {
        const params = {
            date: toDateApi(new Date('2020-01-01')),
            ids: [1010, 1011, 1012],
            enums: [TestEnum.test1, TestEnum.test2, TestEnum.test3],
            string: 'Chaîne de caractères',
            emptyString: '',
            boolean: false,
            null: null,
            undefined: undefined,
        };

        const httpParams = new HttpParams({
            fromObject: {
                date: '2020-01-01',
                ids: '1010,1011,1012',
                enums: '0,1,2',
                string: 'Chaîne de caractères',
                boolean: 'false',
            },
        });

        expect(toHttpParams(params)).toEqual(httpParams);
    });
});
