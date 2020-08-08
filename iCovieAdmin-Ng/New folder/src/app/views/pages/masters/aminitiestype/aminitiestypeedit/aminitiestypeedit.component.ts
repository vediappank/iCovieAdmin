// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// State
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {
	AminitiesModel,
	AminitiesTypeModel,
	Permission,
	selectAminitiesTypeById,
	AminitiesTypeUpdated,
	selectAllPermissions,
	selectAllAminitiesTypes,

	selectLastCreatedAminitiesTypeId,
	AminitiesTypeOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-aminitiestypeedit',
  templateUrl: './aminitiestypeedit.component.html',
  styleUrls: ['./aminitiestypeedit.component.scss']
})
export class AminitiestypeeditComponent implements OnInit {


	allAminitiess: AminitiesModel[] = [];
	unassignedAminitiess: AminitiesModel[] = [];
	assignedAminitiess: AminitiesModel[] = [];
	AminitiesIdForAdding: number;
	AminitiessSubject = new BehaviorSubject<number[]>([]);



	AminitiesType: AminitiesTypeModel;
	AminitiesType$: Observable<AminitiesTypeModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	AminitiesID: any;
	LocationID: any;
	selectedAminities: string;
	selectedLocation: string;
	public defaultLocations = [];
	public filterLocations = [];
	companyid: number;
	locationid: number;

	public defaultAminitiess = [];
	public AdmindefaultAminitiess = [];
	isadmin: any;
	
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<AminitiesTypeeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<AminitiestypeeditComponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getAminitiesLocation = this.auth.getItems();
		this.AminitiesID = getAminitiesLocation[0].AminitiesID;
		this.LocationID = getAminitiesLocation[0].LocationID;
		console.log('Aminities Location One Time Configuration::: ' + JSON.stringify(getAminitiesLocation));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.AminitiesID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}	
		if (this.data.id) {

			this.AminitiesType$ = this.store.pipe(select(selectAminitiesTypeById(this.data.id)));
		} else {

			const newAminitiesType = new AminitiesTypeModel();
			newAminitiesType.clear();
			this.AminitiesType$ = of(newAminitiesType);
		}
		this.AminitiesType$.subscribe(res => {
			if (!res) {
				return;
			}
			
			this.AminitiesType = new AminitiesTypeModel();
      this.AminitiesType.id = res.id;
      this.AminitiesType.aminitiesid = res.aminitiesid;
			this.AminitiesType.aminitiestype = res.aminitiestype;
			this.AminitiesType.aminitiesimages = res.aminitiesimages;
			
			let x = []; 			
			x[0] = res.aminitiesid;
		
			this.AminitiessSubject.next(x[0]);
			this.AminitiesIdForAdding = Number(x[0].toString());

			
		});


		this.auth.GetAllAminities().subscribe((users: AminitiesModel[]) => {
			each(users, (_Aminities: AminitiesModel) => {
				this.allAminitiess.push(_Aminities);
				this.unassignedAminitiess.push(_Aminities);
			});
			if(this.issuperadmin =="False")
				{
					this.allAminitiess = this.allAminitiess.filter(row=>row.id ==this.AminitiesID)
					this.unassignedAminitiess = this.unassignedAminitiess.filter(row=>row.id ==this.AminitiesID);
				}
			each([Number(this.AminitiessSubject.value.toString())], (companyId: number) => {
				const Aminities = find(this.allAminitiess, (_Aminities: AminitiesModel) => {
					return _Aminities.id === companyId;
				});
				if (Aminities) {
					this.assignedAminitiess.push(Aminities);
					remove(this.unassignedAminitiess, Aminities);
				}
			});
		});

		
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}



	/**
	 * Returns AminitiesType for save
	 */
	prepareAminitiesType(): AminitiesTypeModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _AminitiesType = new AminitiesTypeModel();
		if (this.AminitiesIdForAdding != undefined)
			_AminitiesType.aminitiesid = Number(this.AminitiesIdForAdding);
		else
			_AminitiesType.aminitiesid = Number(this.AminitiessSubject.value);

	

		_AminitiesType.id = this.AminitiesType.id;
    _AminitiesType.aminitiestype = this.AminitiesType.aminitiestype;
    _AminitiesType.aminitiesimages = this.AminitiesType.aminitiesimages;
		
		_AminitiesType.cid = loginid;
		return _AminitiesType;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		//
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedAminitiesType = this.prepareAminitiesType();
		if (editedAminitiesType.id > 0) {
			this.updateAminitiesType(editedAminitiesType);
		} else {
			this.createAminitiesType(editedAminitiesType);
		}
	}

	/**
	 * Update AminitiesType
	 *
	 * @param _AminitiesType: AminitiesType
	 */
	updateAminitiesType(_AminitiesType: AminitiesTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateAminitiesType(_AminitiesType).subscribe(data => {
			console.log('UpdateAminitiesType Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_AminitiesType,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create AminitiesType
	 *
	 * @param _AminitiesType: AminitiesType
	 */
	createAminitiesType(_AminitiesType: AminitiesTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createAminitiesType(_AminitiesType).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_AminitiesType,
				isEdit: false
			});
		});
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}


	
	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.AminitiesType && this.AminitiesType.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Amenities Type '${this.AminitiesType.aminitiestype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Amenities Type';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.AminitiesType && this.AminitiesType.aminitiestype.length > 0);
		// return (this.AminitiesType && this.AminitiesType.AminitiesTypename && this.AminitiesType.shortname.length > 0 && this.AminitiestypeIdForAdding != undefined);
	}
}

