// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../../_base/crud';
// State
import { AppState } from '../../../reducers';
// Selectirs
import { selectWingQueryResult, selectWingsPageLoading, selectWingsShowInitWaitingMessage } from '../../_selectors/Master/wing.selectors';

export class WingsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectWingsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectWingsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectWingQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
