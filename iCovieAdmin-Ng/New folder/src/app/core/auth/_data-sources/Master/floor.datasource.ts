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
import { selectFloorQueryResult, selectFloorsPageLoading, selectFloorsShowInitWaitingMessage } from '../../_selectors/Master/floor.selectors';

export class FloorsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectFloorsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectFloorsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectFloorQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
