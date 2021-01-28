import { TestBed, inject } from '@angular/core/testing';
import { HighlightSearchService } from './highlight-search.service';

describe('Service: HighlightSearch', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HighlightSearchService],
        });
    });

    it('Doit ...', inject(
        [HighlightSearchService],
        (service: HighlightSearchService) => {
            expect(service).toBeTruthy();
        }
    ));
});
