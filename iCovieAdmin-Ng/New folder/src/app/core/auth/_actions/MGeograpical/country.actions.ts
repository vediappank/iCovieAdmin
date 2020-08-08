// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MCountryModel } from '../../_models/MGeograpical/mCountry.model';

export enum CountryActionTypes {
    AllCountrysRequested = '[Countrys Home Page] All Countrys Requested',
    AllCountrysLoaded = '[Countrys API] All Countrys Loaded',
    CountryOnServerCreated = '[Edit Country Dialog] Country On Server Created',
    CountryCreated = '[Edit Countrys Dialog] Countrys Created',
    CountryUpdated = '[Edit Country Dialog] Country Updated',
    CountryDeleted = '[Countrys List Page] Country Deleted',
    CountrysPageRequested = '[Countrys List Page] Countrys Page Requested',
    CountrysPageLoaded = '[Countrys API] Countrys Page Loaded',
    CountrysPageCancelled = '[Countrys API] Countrys Page Cancelled',
    CountrysPageToggleLoading = '[Countrys page] Countrys Page Toggle Loading',
    CountrysActionToggleLoading = '[Countrys] Countrys Action Toggle Loading'
}

export class CountryOnServerCreated implements Action {
    readonly type = CountryActionTypes.CountryOnServerCreated;
    constructor(public payload: { Country: MCountryModel }) { }
}

export class CountryCreated implements Action {
    readonly type = CountryActionTypes.CountryCreated;
    constructor(public payload: { Country: MCountryModel }) { }
}

export class CountryUpdated implements Action {
    readonly type = CountryActionTypes.CountryUpdated;
    constructor(public payload: {
        partialCountry: Update<MCountryModel>,
        Country: MCountryModel
    }) { }
}

export class CountryDeleted implements Action {
    readonly type = CountryActionTypes.CountryDeleted;
    constructor(public payload: { id: number }) {}
}

export class CountrysPageRequested implements Action {
    readonly type = CountryActionTypes.CountrysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CountrysPageLoaded implements Action {
    readonly type = CountryActionTypes.CountrysPageLoaded;
    constructor(public payload: { Countrys: MCountryModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class CountrysPageCancelled implements Action {
    readonly type = CountryActionTypes.CountrysPageCancelled;
}

export class AllCountrysRequested implements Action {
    readonly type = CountryActionTypes.AllCountrysRequested;
}

export class AllCountrysLoaded implements Action {
    readonly type = CountryActionTypes.AllCountrysLoaded;
    constructor(public payload: { Countrys: MCountryModel[] }) { }
}

export class CountrysPageToggleLoading implements Action {
    readonly type = CountryActionTypes.CountrysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CountrysActionToggleLoading implements Action {
    readonly type = CountryActionTypes.CountrysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CountryActions = CountryCreated
| CountryUpdated
| CountryDeleted
| CountrysPageRequested
| CountrysPageLoaded
| CountrysPageCancelled
| AllCountrysLoaded
| AllCountrysRequested
| CountryOnServerCreated
| CountrysPageToggleLoading
| CountrysActionToggleLoading;
