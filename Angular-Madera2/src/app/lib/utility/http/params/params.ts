import { HttpParams } from '@angular/common/http';
import { chain, isEmpty, isNil } from 'lodash';

export function toHttpParams(params: Record<string, any>): HttpParams {
    const cleanParams = chain(params)
        .omitBy(isNil)
        .mapValues((v) => v.toString())
        .omitBy(isEmpty)
        .value();

    return new HttpParams({
        fromObject: cleanParams,
    });
}
