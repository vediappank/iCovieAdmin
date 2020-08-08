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
import { selectBusinessCategoryQueryResult, selectBusinessCategorysPageLoading, selectBusinessCategorysShowInitWaitingMessage } from '../../_selectors/Masters/businesscategory.selectors';

export class BusinessCategorysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectBusinessCategorysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectBusinessCategorysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectBusinessCategoryQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
