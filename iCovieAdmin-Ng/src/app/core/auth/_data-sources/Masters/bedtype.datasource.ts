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
import { selectBedTypeQueryResult, selectBedTypesPageLoading, selectBedTypesShowInitWaitingMessage } from '../../_selectors/Masters/bedtype.selectors';

export class BedTypesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectBedTypesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectBedTypesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectBedTypeQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
