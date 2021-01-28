import { Observable } from 'rxjs';

import { CustomFile } from './custom-file';
import { Injectable } from '@angular/core';

/**
 * Factory pour la création de CustomFile
 */
@Injectable()
export class CustomFileService {
    /**
     * Crée un observable founisant une instance de CustomFile à partir d'un objet File natif
     */
    public createFromFile(file: File): Observable<CustomFile> {
        return new Observable<CustomFile>((observe) => {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                observe.next({
                    content: reader.result as string,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });

                observe.complete();
            });

            reader.readAsDataURL(file);
        });
    }

    /**
     * Crée une instance de CustomFile à partir d'une chaine de caractère formaté base64
     */
    public createFromString(string: string): CustomFile {
        const file: CustomFile = {
            content: '',
            name: '',
            size: null,
            type: '',
        };

        let matches = [];

        if (
            string !== null &&
            null !== (matches = string.match(/^data:([\w\d\/]+?);base64,/))
        ) {
            file.content = string;
            file.type = matches.pop();
        }

        return file;
    }
}
