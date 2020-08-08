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
import { selectAminitiesTypeQueryResult, selectAminitiesTypesPageLoading, selectAminitiesTypesShowInitWaitingMessage } from '../../_selectors/Masters/aminitiestype.selectors';

export class AminitiesTypesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAminitiesTypesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAminitiesTypesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAminitiesTypeQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
