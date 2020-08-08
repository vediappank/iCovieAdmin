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
import { selectCompanyQueryResult, selectCompanysPageLoading, selectCompanysShowInitWaitingMessage } from '../../_selectors/Master/Company.selectors';

export class CompanysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCompanysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCompanysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCompanyQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
