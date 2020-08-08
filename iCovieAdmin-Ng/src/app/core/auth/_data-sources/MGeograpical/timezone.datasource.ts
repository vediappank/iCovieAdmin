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
import { selectTimeZoneQueryResult, selectTimeZonesPageLoading, selectTimeZonesShowInitWaitingMessage } from '../../_selectors/MGeograpical/TimeZone.selectors';

export class TimeZonesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectTimeZonesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectTimeZonesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectTimeZoneQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
