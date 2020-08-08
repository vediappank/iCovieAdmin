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
import { selectWingTypeQueryResult, selectWingTypesPageLoading, selectWingTypesShowInitWaitingMessage } from '../../_selectors/Masters/wingtype.selectors';

export class WingTypesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectWingTypesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectWingTypesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectWingTypeQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
