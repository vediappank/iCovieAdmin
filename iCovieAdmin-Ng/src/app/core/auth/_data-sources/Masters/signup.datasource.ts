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
import { selectSignupQueryResult, selectSignupsPageLoading, selectSignupsShowInitWaitingMessage } from '../../_selectors/Masters/signup.selectors';

export class SignupsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectSignupsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectSignupsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectSignupQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
