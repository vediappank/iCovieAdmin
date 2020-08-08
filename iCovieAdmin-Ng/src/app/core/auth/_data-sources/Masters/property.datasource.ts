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
import { selectPropertyQueryResult, selectPropertysPageLoading, selectPropertysShowInitWaitingMessage } from '../../_selectors/Masters/property.selectors';

export class PropertysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectPropertysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectPropertysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectPropertyQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
