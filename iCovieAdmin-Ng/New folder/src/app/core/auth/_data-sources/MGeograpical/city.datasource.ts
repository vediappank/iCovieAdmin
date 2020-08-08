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
import { selectCityQueryResult, selectCitysPageLoading, selectCitysShowInitWaitingMessage } from '../../_selectors/MGeograpical/City.selectors';

export class CitysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCitysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCitysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCityQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
