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
import { selectAminitiesNeighbourhoodQueryResult, selectAminitiesNeighbourhoodsPageLoading, selectAminitiesNeighbourhoodsShowInitWaitingMessage } from '../../_selectors/Masters/aminitiesneighbourhood.selectors';

export class AminitiesNeighbourhoodsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAminitiesNeighbourhoodsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAminitiesNeighbourhoodsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAminitiesNeighbourhoodQueryResult)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});

	}
}
