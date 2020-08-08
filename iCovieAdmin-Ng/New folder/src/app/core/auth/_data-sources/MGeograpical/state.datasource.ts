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
import { selectStateQueryResult, selectStatesPageLoading, selectStatesShowInitWaitingMessage } from '../../_selectors/MGeograpical/State.selectors';

export class StatesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectStatesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectStatesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectStateQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
