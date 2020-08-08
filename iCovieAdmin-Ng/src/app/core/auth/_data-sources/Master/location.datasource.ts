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
import { selectLocationQueryResult, selectLocationsPageLoading, selectLocationsShowInitWaitingMessage } from '../../_selectors/Master/Location.selectors';

export class LocationsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectLocationsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectLocationsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectLocationQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
