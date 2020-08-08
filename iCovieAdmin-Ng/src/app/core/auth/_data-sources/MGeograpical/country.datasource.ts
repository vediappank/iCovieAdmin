// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../../_base/crud';
// State
import { AppState } from '../../../../core/reducers';
// Selectirs
import { selectCountryQueryResult, selectCountrysPageLoading, selectCountrysShowInitWaitingMessage } from '../../_selectors/MGeograpical/Country.selectors';

export class CountrysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCountrysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCountrysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCountryQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
