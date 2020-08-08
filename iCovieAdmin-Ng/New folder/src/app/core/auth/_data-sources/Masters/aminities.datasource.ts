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
import { selectAminitiesQueryResult, selectAminitiessPageLoading, selectAminitiessShowInitWaitingMessage } from '../../_selectors/Masters/aminities.selectors';

export class AminitiessDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAminitiessPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAminitiessShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAminitiesQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
