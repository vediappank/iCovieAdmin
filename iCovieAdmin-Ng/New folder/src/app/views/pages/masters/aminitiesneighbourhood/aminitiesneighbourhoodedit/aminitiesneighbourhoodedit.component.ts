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
	AminitiesNeighbourhoodModel,
	AminitiesTypeModel,
	NeighbourhoodCategoryModel,
	Permission,
	selectAminitiesNeighbourhoodById,
	AminitiesNeighbourhoodUpdated,
	selectAllPermissions,
	selectAllAminitiesNeighbourhoods,

	selectLastCreatedAminitiesNeighbourhoodId,
	AminitiesNeighbourhoodOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-aminitiesneighbourhoodedit',
  templateUrl: './aminitiesneighbourhoodedit.component.html',
  styleUrls: ['./aminitiesneighbourhoodedit.component.scss']
})
export class AminitiesneighbourhoodeditComponent implements OnInit {


	allNeighbourhoodcategorys: NeighbourhoodCategoryModel[] = [];
	unassignedNeighbourhoodcategorys: NeighbourhoodCategoryModel[] = [];
	assignedNeighbourhoodcategorys: NeighbourhoodCategoryModel[] = [];
	NeighbourhoodcategoryIdForAdding: number;
	NeighbourhoodcategorysSubject = new BehaviorSubject<number[]>([]);



	AminitiesNeighbourhood: AminitiesNeighbourhoodModel;
	AminitiesNeighbourhood$: Observable<AminitiesNeighbourhoodModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	NeighbourhoodcategoryID: any;
	LocationID: any;
	selectedNeighbourhoodcategory: string;
	selectedLocation: string;
	public defaultLocations = [];
	public filterLocations = [];
	companyid: number;
	locationid: number;

	public defaultNeighbourhoodcategorys = [];
	public AdmindefaultNeighbourhoodcategorys = [];
	isadmin: any;
	
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<AminitiesNeighbourhoodeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<AminitiesneighbourhoodeditComponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getNeighbourhoodcategoryLocation = this.auth.getItems();
		this.NeighbourhoodcategoryID = getNeighbourhoodcategoryLocation[0].NeighbourhoodcategoryID;
		this.LocationID = getNeighbourhoodcategoryLocation[0].LocationID;
		console.log('Neighbourhoodcategory Location One Time Configuration::: ' + JSON.stringify(getNeighbourhoodcategoryLocation));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.NeighbourhoodcategoryID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}	
		if (this.data.id) {

			this.AminitiesNeighbourhood$ = this.store.pipe(select(selectAminitiesNeighbourhoodById(this.data.id)));
		} else {

			const newAminitiesNeighbourhood = new AminitiesNeighbourhoodModel();
			newAminitiesNeighbourhood.clear();
			this.AminitiesNeighbourhood$ = of(newAminitiesNeighbourhood);
		}
		this.AminitiesNeighbourhood$.subscribe(res => {
			if (!res) {
				return;
			}
			
			this.AminitiesNeighbourhood = new AminitiesNeighbourhoodModel();
			this.AminitiesNeighbourhood.id = res.id;
			this.AminitiesNeighbourhood.neighbourhoodcategoryid = res.neighbourhoodcategoryid;
			this.AminitiesNeighbourhood.neighbourhoodtype = res.neighbourhoodtype;
			
			let x = []; 			
			x[0] = res.neighbourhoodcategoryid;
		
			this.NeighbourhoodcategorysSubject.next(x[0]);
			this.NeighbourhoodcategoryIdForAdding = Number(x[0].toString());

			
		});


		this.auth.GetALLNeighbourhoodCategory().subscribe((users: NeighbourhoodCategoryModel[]) => {
			each(users, (_Neighbourhoodcategory: NeighbourhoodCategoryModel) => {
				this.allNeighbourhoodcategorys.push(_Neighbourhoodcategory);
				this.unassignedNeighbourhoodcategorys.push(_Neighbourhoodcategory);
			});
			if(this.issuperadmin =="False")
				{
					this.allNeighbourhoodcategorys = this.allNeighbourhoodcategorys.filter(row=>row.id ==this.NeighbourhoodcategoryID)
					this.unassignedNeighbourhoodcategorys = this.unassignedNeighbourhoodcategorys.filter(row=>row.id ==this.NeighbourhoodcategoryID);
				}
			each([Number(this.NeighbourhoodcategorysSubject.value.toString())], (companyId: number) => {
				const Neighbourhoodcategory = find(this.allNeighbourhoodcategorys, (_Neighbourhoodcategory: NeighbourhoodCategoryModel) => {
					return _Neighbourhoodcategory.id === companyId;
				});
				if (Neighbourhoodcategory) {
					this.assignedNeighbourhoodcategorys.push(Neighbourhoodcategory);
					remove(this.unassignedNeighbourhoodcategorys, Neighbourhoodcategory);
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
	 * Returns AminitiesNeighbourhood for save
	 */
	prepareAminitiesNeighbourhood(): AminitiesNeighbourhoodModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _AminitiesNeighbourhood = new AminitiesNeighbourhoodModel();
		if (this.NeighbourhoodcategoryIdForAdding != undefined)
			_AminitiesNeighbourhood.neighbourhoodcategoryid = Number(this.NeighbourhoodcategoryIdForAdding);
		else
			_AminitiesNeighbourhood.neighbourhoodcategoryid = Number(this.NeighbourhoodcategorysSubject.value);


		_AminitiesNeighbourhood.id = this.AminitiesNeighbourhood.id;
		_AminitiesNeighbourhood.neighbourhoodtype = this.AminitiesNeighbourhood.neighbourhoodtype;
		
		_AminitiesNeighbourhood.cid = loginid;
		return _AminitiesNeighbourhood;
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
		const editedAminitiesNeighbourhood = this.prepareAminitiesNeighbourhood();
		if (editedAminitiesNeighbourhood.id > 0) {
			this.updateAminitiesNeighbourhood(editedAminitiesNeighbourhood);
		} else {
			this.createAminitiesNeighbourhood(editedAminitiesNeighbourhood);
		}
	}

	/**
	 * Update AminitiesNeighbourhood
	 *
	 * @param _AminitiesNeighbourhood: AminitiesNeighbourhood
	 */
	updateAminitiesNeighbourhood(_AminitiesNeighbourhood: AminitiesNeighbourhoodModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateAminitiesNeighbourhood(_AminitiesNeighbourhood).subscribe(data => {
			console.log('UpdateAminitiesNeighbourhood Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_AminitiesNeighbourhood,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create AminitiesNeighbourhood
	 *
	 * @param _AminitiesNeighbourhood: AminitiesNeighbourhood
	 */
	createAminitiesNeighbourhood(_AminitiesNeighbourhood: AminitiesNeighbourhoodModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createAminitiesNeighbourhood(_AminitiesNeighbourhood).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_AminitiesNeighbourhood,
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
		if (this.AminitiesNeighbourhood && this.AminitiesNeighbourhood.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Neighbourhood Type '${this.AminitiesNeighbourhood.neighbourhoodtype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Neighbourhood Type';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.AminitiesNeighbourhood && this.AminitiesNeighbourhood.neighbourhoodtype.length > 0);
		// return (this.AminitiesNeighbourhood && this.AminitiesNeighbourhood.AminitiesNeighbourhoodname && this.AminitiesNeighbourhood.shortname.length > 0 && this.NeighbourhoodcategoryIdForAdding != undefined);
	}
}
