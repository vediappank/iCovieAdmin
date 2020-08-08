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
import { selectPropertyCategoryQueryResult, selectPropertyCategorysPageLoading, selectPropertyCategorysShowInitWaitingMessage } from '../../_selectors/Masters/propertycategory.selectors';

export class PropertyCategorysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectPropertyCategorysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectPropertyCategorysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectPropertyCategoryQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
