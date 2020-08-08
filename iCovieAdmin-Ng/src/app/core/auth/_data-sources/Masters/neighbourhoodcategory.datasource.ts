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
import { selectNeighbourhoodCategoryQueryResult, selectNeighbourhoodCategorysPageLoading, selectNeighbourhoodCategorysShowInitWaitingMessage } from '../../_selectors/Masters/neighbourhoodcategory.selectors';

export class NeighbourhoodCategorysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectNeighbourhoodCategorysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectNeighbourhoodCategorysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectNeighbourhoodCategoryQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
