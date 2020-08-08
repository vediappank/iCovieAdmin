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
import { selectRegionQueryResult, selectRegionsPageLoading, selectRegionsShowInitWaitingMessage } from '../../_selectors/MGeograpical/Region.selectors';

export class RegionsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectRegionsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectRegionsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectRegionQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
