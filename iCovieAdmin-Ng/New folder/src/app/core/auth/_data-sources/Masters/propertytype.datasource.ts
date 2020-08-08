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
import { selectPropertyTypeQueryResult, selectPropertyTypesPageLoading, selectPropertyTypesShowInitWaitingMessage } from '../../_selectors/Masters/propertytype.selectors';

export class PropertyTypesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectPropertyTypesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectPropertyTypesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectPropertyTypeQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
