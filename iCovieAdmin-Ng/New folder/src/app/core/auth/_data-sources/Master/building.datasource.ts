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
import { selectBuildingQueryResult, selectBuildingsPageLoading, selectBuildingsShowInitWaitingMessage } from '../../_selectors/Master/building.selectors';

export class BuildingsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectBuildingsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectBuildingsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectBuildingQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
