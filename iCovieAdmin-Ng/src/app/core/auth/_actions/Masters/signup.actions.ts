
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { SignupModel } from '../../_models/Masters/signup.model';

export enum SignupActionTypes {
    AllSignupsRequested = '[Signups Home Page] All Signups Requested',
    AllSignupsLoaded = '[Signups API] All Signups Loaded',
    SignupOnServerCreated = '[Edit Signup Dialog] Signup On Server Created',
    SignupCreated = '[Edit Signups Dialog] Signups Created',
    SignupUpdated = '[Edit Signup Dialog] Signup Updated',
    SignupDeleted = '[Signups List Page] Signup Deleted',
    SignupsPageRequested = '[Signups List Page] Signups Page Requested',
    SignupsPageLoaded = '[Signups API] Signups Page Loaded',
    SignupsPageCancelled = '[Signups API] Signups Page Cancelled',
    SignupsPageToggleLoading = '[Signups page] Signups Page Toggle Loading',
    SignupsActionToggleLoading = '[Signups] Signups Action Toggle Loading'
}

export class SignupOnServerCreated implements Action {
    readonly type = SignupActionTypes.SignupOnServerCreated;
    constructor(public payload: { Signup: SignupModel }) { }
}

export class SignupCreated implements Action {
    readonly type = SignupActionTypes.SignupCreated;
    constructor(public payload: { Signup: SignupModel }) { }
}

export class SignupUpdated implements Action {
    readonly type = SignupActionTypes.SignupUpdated;
    constructor(public payload: {
        partialSignup: Update<SignupModel>,
        Signup: SignupModel
    }) { }
}

export class SignupDeleted implements Action {
    readonly type = SignupActionTypes.SignupDeleted;
    constructor(public payload: { id: number }) {}
}

export class SignupsPageRequested implements Action {
    readonly type = SignupActionTypes.SignupsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class SignupsPageLoaded implements Action {
    readonly type = SignupActionTypes.SignupsPageLoaded;
    constructor(public payload: { Signups: SignupModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class SignupsPageCancelled implements Action {
    readonly type = SignupActionTypes.SignupsPageCancelled;
}

export class AllSignupsRequested implements Action {
    readonly type = SignupActionTypes.AllSignupsRequested;
}

export class AllSignupsLoaded implements Action {
    readonly type = SignupActionTypes.AllSignupsLoaded;
    constructor(public payload: { Signups: SignupModel[] }) { }
}

export class SignupsPageToggleLoading implements Action {
    readonly type = SignupActionTypes.SignupsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class SignupsActionToggleLoading implements Action {
    readonly type = SignupActionTypes.SignupsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type SignupActions = SignupCreated
| SignupUpdated
| SignupDeleted
| SignupsPageRequested
| SignupsPageLoaded
| SignupsPageCancelled
| AllSignupsLoaded
| AllSignupsRequested
| SignupOnServerCreated
| SignupsPageToggleLoading
| SignupsActionToggleLoading;

