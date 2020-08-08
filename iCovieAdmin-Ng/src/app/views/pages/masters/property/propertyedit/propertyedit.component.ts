// Angular
import {
	Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy,
	ViewChild, ɵbypassSanitizationTrustResourceUrl, Injectable, EventEmitter
} from '@angular/core';
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
	PropertyModel,
	MCompanyModel,
	AminitiesModel,
	AminitiesTypeModel,
	PropertyImagesModel,
	PropertyAminitiesModel,
	Permission,
	selectPropertyById,
	PropertyUpdated,
	selectAllPermissions,
	selectAllPropertys,

	selectLastCreatedPropertyId,
	PropertyOnServerCreated,
	MLocationModel,
	MBuildingModel,
	MFloorModel,
	MWingModel,
	WingTypeModel,
	UpdatePropertyImagesModel,
	Role,
	User,
	PropertyTypeModel,
	PropertyCategoryModel,
	GuestTypeModel,
	BusinessCategoryModel,
	BedTypeModel,
	GenderModel,
	NeighbourhoodCategoryModel,
	AminitiesNeighbourhoodModel,
	PropertyNeighbourTypeModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';
import { UpdatePropertyImagesRequestModel } from '../../../../../core/auth/_models/Masters/uploadimagesrequest.model';
import moment from 'moment';



@Component({
	selector: 'kt-propertyedit',
	templateUrl: './propertyedit.component.html',
	styleUrls: ['./propertyedit.component.scss']
})

export class PropertyeditComponent implements OnInit {


	aminitiesCollection: Array<AminitiesModel> = [];
	aminitiesTypeCollection: Array<AminitiesTypeModel> = [];
	aminitiesTypeCollectionByID: Array<AminitiesTypeModel> = [];

	neighbourcategoryCollection: Array<NeighbourhoodCategoryModel> = [];
	neighbourTypeCollection: Array<AminitiesNeighbourhoodModel> = [];
	neighbourTypeCollectionByNID: Array<AminitiesNeighbourhoodModel> = [];

	selectedPropertyNeighbourTypeList: PropertyNeighbourTypeModel[] = [];
	selectedAminitsTypeList: PropertyAminitiesModel[] = [];
	editselectedAminitsTypeList: PropertyAminitiesModel[] = [];
	selectedImagesList: PropertyImagesModel[] = [];
	editselectedImagesList: UpdatePropertyImagesModel[] = [];
	ImagesList: PropertyImagesModel;
	propertyImagesrequest: UpdatePropertyImagesRequestModel;
	selectedAminitsType: PropertyAminitiesModel;
	selectedPropertyNeighbourType: PropertyNeighbourTypeModel;

	PropertyID: any;
	public adminmenucontrol: Boolean = false;
	
	url = '';
	

	allBuildings: MBuildingModel[] = [];
	filteredBuildings: MBuildingModel[] = [];
	BuildingIdForAdding: any;


	allFloors: MFloorModel[] = [];
	filteredFloors: MFloorModel[] = [];
	FloorIdForAdding: number;

	allUnitsType: WingTypeModel[] = [];
	filteredUnitsType: WingTypeModel[] = [];
	allSelectedUnitsType: WingTypeModel[] = [];

	allUnits: MWingModel[] = [];	
	filteredUnits: MWingModel[] = [];	
	UnitsIdForAdding: number;

	allCommunityRole: Role[] = [];
	CommunityRoleIdForAdding: number;

	allCommunityUser: User[] = [];
	filteredCommunityUser: User[] = [];
	CommunityUserIdForAdding: number;

	allFacilityRole: Role[] = [];	
	FacilityRoleIdForAdding: number;
	


	allFacilityUser: User[] = [];
	filteredFacilityUser: User[] = [];	
	FacilityUserIdForAdding: number;


	// Property Setups
	allBedtype: BedTypeModel[] = [];	
	BedtypesIdForAdding: number;


	allBusinesscategory: BusinessCategoryModel[] = [];
	BusinesscategorysIdForAdding: number;


	allGuesttype: GuestTypeModel[] = [];
	GuesttypesIdForAdding: number;
	

	allPropertycategory: PropertyCategoryModel[] = [];
	PropertycategoryIdForAdding: number;



	allPropertytype: PropertyTypeModel[] = [];	
	PropertytypeIdForAdding: number;
	
	
	allGender: GenderModel[] = [];	
	GenderIdForAdding: number;

	// End
	Property: PropertyModel;
	Property$: Observable<PropertyModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CompanyID: any;
	LocationID: any;
	selectedCompany: string;
	selectedLocation: string;
	public defaultLocations = [];
	public filterLocations = [];
	companyid: number;
	locationid: number;

	public defaultCompanys = [];
	public AdmindefaultCompanys = [];
	isadmin: any;
	issuperadmin: any;
	previewUrl: string | ArrayBuffer;
	UnitsTypeIdForAdding: any[];


	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<PropertyeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<PropertyeditComponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getCompanyLocation = this.auth.getItems();
		this.CompanyID = getCompanyLocation[0].CompanyID;
		this.LocationID = getCompanyLocation[0].LocationID;
		console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.getAllAminities();
		this.getAllAminitiesType();
		this.getAllNeighbourCategory();
		this.getAllNeighbourTypeCollection();
		if (localStorage.hasOwnProperty('currentUser')) {
			this.CompanyID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {
			this.PropertyID = this.data.id;
			this.Property$ = this.store.pipe(select(selectPropertyById(this.data.id)));
		} else {
			this.PropertyID = 0;
			const newProperty = new PropertyModel();
			newProperty.clear();
			this.Property$ = of(newProperty);
		}
		this.Property$.subscribe(res => {
			if (!res) {
				return;
			}
			debugger;
			this.Property = new PropertyModel();
			this.Property.id = res.id;
			this.Property.companyid = res.companyid;
			this.Property.locationid = res.locationid;
			this.Property.buildingid = res.buildingid;
			this.Property.floorid = res.floorid;
			this.Property.unitsid = res.unitsid;
			this.Property.address = res.address;
			this.Property.noofbeds = res.noofbeds;
			this.Property.noofboths = res.noofboths;
			this.Property.sqft = res.sqft;
			this.Property.cost = res.cost;
			this.Property.facilitymangerid = res.facilitymangerid;
			this.Property.facilityuserid = res.facilityuserid;
			this.Property.communitymangerid = res.communitymangerid;
			this.Property.communityuserid = res.communityuserid;
			this.Property.pincode = res.pincode;
			this.Property.pricing = res.pricing;

			this.Property.description = res.description;
			this.Property.coordinates = res.coordinates;
			this.Property.phoneno1 = res.phoneno1;
			this.Property.phoneno2 = res.phoneno2;
			this.Property.phoneno3 = res.phoneno3;

			this.Property.propertyname = res.propertyname;
			this.Property.yearbuild = moment(res.yearbuild).format('M/DD/YYYY'); 
			this.Property.propertyvideo = res.propertyvideo;

			this.Property.bedtype = res.bedtype;
			this.Property.businesscategory = res.businesscategory;
			this.Property.guesttype = res.guesttype;
			this.Property.propertycategory = res.propertycategory;
			this.Property.propertytype = res.propertytype;
			this.Property.discountpricing = res.discountpricing;
			this.Property.gender = res.gender;
			//this.Property.isCore = res.isCore;
			if (this.data.id > 0) {

				if (res.AminitsTypeList.length > 0) {
					for (let i = 0; i < res.AminitsTypeList.length; i++) {
						this.selectedAminitsType = {
							aminitiesid: res.AminitsTypeList[i].aminitiesid, aminitiestypeid: res.AminitsTypeList[i].aminitiestypeid
						}
						this.selectedAminitsTypeList.push(this.selectedAminitsType);
					}
				}
				if (res.NeighbourCategoryTypeList.length > 0) {
					for (let i = 0; i < res.NeighbourCategoryTypeList.length; i++) {
						this.selectedPropertyNeighbourType = {
							PropertyNeighbourCategoryid: res.NeighbourCategoryTypeList[i].PropertyNeighbourCategoryid, PropertyNeighbourTypeid: res.NeighbourCategoryTypeList[i].PropertyNeighbourTypeid
						}
						this.selectedPropertyNeighbourTypeList.push(this.selectedPropertyNeighbourType);
					}
				}
				if (res.ImagesList.length > 0) {
					for (let i = 0; i < res.ImagesList.length; i++) {
						this.ImagesList = {
							imagename: res.ImagesList[i].imagename,
							imagepath: res.ImagesList[i].imagepath,
							propertyid: res.ImagesList[i].propertyid,
							showimagepath: res.ImagesList[i].showimagepath
						}
						this.editselectedImagesList.push(this.ImagesList);
					}
				}

				this.BuildingIdForAdding = Number(res.buildingid);
				this.FloorIdForAdding = Number(res.floorid);
				this.UnitsIdForAdding = Number(res.unitsid);
				this.CommunityRoleIdForAdding = Number(res.communitymangerid);
				this.CommunityUserIdForAdding = Number(res.communityuserid);
				this.FacilityRoleIdForAdding = Number(res.facilitymangerid);
				this.FacilityUserIdForAdding = Number(res.facilityuserid);
				this.BedtypesIdForAdding = Number(res.bedtype);
				this.BusinesscategorysIdForAdding = Number(res.businesscategory);
				this.PropertycategoryIdForAdding = Number(res.propertycategory);
				this.GenderIdForAdding = Number(res.gender);
				this.GuesttypesIdForAdding = Number(res.guesttype);
				this.PropertytypeIdForAdding = Number(res.propertytype);
			}
		});
		this.auth.GetALLBuilding().subscribe((_Building: MBuildingModel[]) => {
			this.allBuildings = _Building;
			this.filteredBuildings = this.allBuildings;
		});
		this.auth.GetALLFloor().subscribe((floors: MFloorModel[]) => {
			this.allFloors = floors;
			this.filteredFloors = this.allFloors;
		});

		this.auth.GetALLWing().subscribe((_Units: MWingModel[]) => {
			this.allUnits = _Units;
			this.filteredUnits = this.allUnits;
		});
		this.auth.GetAllWingType().subscribe((_Unitstype: WingTypeModel[]) => {
			this.allUnitsType = _Unitstype;
			this.allSelectedUnitsType = _Unitstype;
			this.UnitsTypeIdForAdding = _Unitstype;
		});

		//Property Setup

		this.auth.GetAllBedType().subscribe((_BedType: BedTypeModel[]) => {
			this.allBedtype = _BedType;
		});

		this.auth.GetAllBusinessCategory().subscribe((_BusinessCategory: BusinessCategoryModel[]) => {
			this.allBusinesscategory = _BusinessCategory;
		});

		this.auth.GetAllGuestType().subscribe((_GuestType: GuestTypeModel[]) => {
			this.allGuesttype = _GuestType;

		});

		this.auth.GetAllPropertyCategory().subscribe((_PropertyCategory: PropertyCategoryModel[]) => {
			this.allPropertycategory = _PropertyCategory;

		});

		this.auth.GetAllPropertyType().subscribe((_PropertyType: PropertyTypeModel[]) => {
			this.allPropertytype = _PropertyType;

		});

		this.auth.GetAllGender().subscribe((_Gender: GenderModel[]) => {
			this.allGender = _Gender;

		});


		//Community Role Manager 
		this.auth.getAllRoles().subscribe((_Role: Role[]) => {
			this.allCommunityRole = _Role.filter(row => row.companyid == this.CompanyID && row.locationid == this.LocationID);


		});

		//Community User 
		this.auth.getAllUsers().subscribe((_User: User[]) => {
			this.allCommunityUser = _User.filter(row => row.companyid == this.CompanyID && row.locationid == this.LocationID);
			this.filteredCommunityUser = this.allCommunityUser;
		});

		//Facility Manager Role
		this.auth.getAllRoles().subscribe((_Role: Role[]) => {
			this.allFacilityRole = _Role.filter(row => row.companyid == this.CompanyID && row.locationid == this.LocationID);

		});

		//Community User 
		this.auth.getAllUsers().subscribe((_User: User[]) => {
			this.allFacilityUser = _User.filter(row => row.companyid == this.CompanyID && row.locationid == this.LocationID);
			this.filteredFacilityUser= this.allFacilityUser;
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
	 * Returns Property for save
	 */
	prepareProperty(): PropertyModel {

		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Property = new PropertyModel();
		_Property.companyid = this.CompanyID;
		_Property.locationid = this.LocationID;

		_Property.buildingid = Number(this.BuildingIdForAdding);
		_Property.floorid = Number(this.FloorIdForAdding);
		_Property.unitsid = Number(this.UnitsIdForAdding);
		_Property.communitymangerid = Number(this.CommunityRoleIdForAdding);
		_Property.communityuserid = Number(this.CommunityUserIdForAdding);
		_Property.facilitymangerid = Number(this.FacilityRoleIdForAdding);
		_Property.facilityuserid = Number(this.FacilityUserIdForAdding);
		_Property.bedtype = Number(this.BedtypesIdForAdding);
		_Property.businesscategory = Number(this.BusinesscategorysIdForAdding);
		_Property.guesttype = Number(this.GuesttypesIdForAdding);
		_Property.propertycategory = Number(this.PropertycategoryIdForAdding);
		_Property.propertytype = Number(this.PropertytypeIdForAdding);
		_Property.gender = Number(this.GenderIdForAdding);
		_Property.id = this.Property.id;
		_Property.address = this.Property.address;
		_Property.noofbeds = this.Property.noofbeds;
		_Property.noofboths = this.Property.noofboths;
		_Property.sqft = this.Property.sqft;
		_Property.pincode = this.Property.pincode;
		_Property.description = this.Property.description;
		_Property.coordinates = this.Property.coordinates;
		_Property.cost = this.Property.cost;
		_Property.pricing = this.Property.pricing;
		_Property.phoneno1 = this.Property.phoneno1;
		_Property.phoneno2 = this.Property.phoneno2;
		_Property.phoneno3 = this.Property.phoneno3;

		_Property.discountpricing = this.Property.discountpricing;
		_Property.propertyname = this.Property.propertyname;
		_Property.yearbuild = moment(this.Property.yearbuild).format('YYYY-MM-DDTHH:mm:ss');
		_Property.propertyvideo = this.Property.propertyvideo;

		_Property.cid = loginid;
		_Property.AminitsTypeList = this.selectedAminitsTypeList;
		_Property.NeighbourCategoryTypeList = this.selectedPropertyNeighbourTypeList;

		return _Property;
	}

	/**
	 * Save data
	 */
	onSubmit() {

		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}

		const editedProperty = this.prepareProperty();
		if (editedProperty.id > 0) {
			this.updateProperty(editedProperty);
		} else {
			this.createProperty(editedProperty);
		}
	}

	/**
	 * Update Property
	 *
	 * @param _Property: Property
	 */
	updateProperty(_Property: PropertyModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		this.auth.updateProperty(_Property).subscribe(propertyID => {

			console.log('UpdateProperty Data received: ' + propertyID)
			if (propertyID > 0) {
				this.uploadFiles(Number(propertyID));

			}
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Property,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Property
	 *
	 * @param _Property: Property
	 */
	createProperty(_Property: PropertyModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		this.auth.createProperty(_Property).subscribe(propertyID => {
			console.log('Inserted Data received: ' + propertyID)
			this.viewLoading = false;
			if (propertyID > 0) {
				this.uploadFiles(Number(propertyID));
				///this.UpadtePropertyImages();
			}
			this.dialogRef.close({
				_Property,
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



	onChange(event, Selectdata: AminitiesTypeModel) {

		if (event.checked) {
			this.selectedAminitsType = {
				aminitiesid: Selectdata.aminitiesid, aminitiestypeid: Selectdata.id
			}
			this.selectedAminitsTypeList.push(this.selectedAminitsType);
		} else {
			this.selectedAminitsType = {
				aminitiesid: Selectdata.aminitiesid, aminitiestypeid: Selectdata.id
			}
			const index = this.selectedAminitsTypeList.findIndex(x => x.aminitiesid === Selectdata.aminitiesid && x.aminitiestypeid === Selectdata.id);
			//let index = this.selectedAminitsTypeList.indexOf(this.selectedAminitsType);
			this.selectedAminitsTypeList.splice(index, 1);
		}
		console.log('Selected Aminities Collection:::' + JSON.stringify(this.selectedAminitsTypeList));
	}

	onNeighbourChange(event, Selectdata: AminitiesNeighbourhoodModel) {


		if (event.checked) {
			this.selectedPropertyNeighbourType = {
				PropertyNeighbourCategoryid: Selectdata.neighbourhoodcategoryid, PropertyNeighbourTypeid: Selectdata.id
			}
			this.selectedPropertyNeighbourTypeList.push(this.selectedPropertyNeighbourType);
		} else {
			this.selectedPropertyNeighbourType = {
				PropertyNeighbourCategoryid: Selectdata.neighbourhoodcategoryid, PropertyNeighbourTypeid: Selectdata.id
			}
			const index = this.selectedPropertyNeighbourTypeList.findIndex(x => x.PropertyNeighbourCategoryid === Selectdata.neighbourhoodcategoryid && x.PropertyNeighbourTypeid === Selectdata.id);
			//let index = this.selectedAminitsTypeList.indexOf(this.selectedAminitsType);
			this.selectedPropertyNeighbourTypeList.splice(index, 1);
		}
		console.log('Selected Neighbourcategory Collection:::' + JSON.stringify(this.selectedPropertyNeighbourTypeList));
	}




	getBuildingByLocation() {
		if (this.allBuildings.length > 0) {
			this.filteredBuildings = this.allBuildings.filter(row => row.locationid == this.LocationID);
		}
		this.BuildingIdForAdding = this.filteredBuildings[0].id;
	}

	getFloorByBuilding() {
		if (this.allFloors.length > 0) {
			this.filteredFloors = this.allFloors.filter(row => row.buildingid == Number(this.BuildingIdForAdding));
		}
		this.FloorIdForAdding = this.filteredFloors[0].id;
	}

	getWingByFloor() {
		if (this.allUnits.length > 0) {
			this.filteredUnits = this.allUnits.filter(row => row.floorid == Number(this.FloorIdForAdding));
		}
		this.UnitsIdForAdding = this.filteredUnits[0].id;
	}
	getWingTypeByWing() {
		if (this.allUnitsType.length > 0) {
			this.allSelectedUnitsType = this.allUnitsType.filter(row => row.unitsid == Number(this.UnitsIdForAdding));
		}
	}


	getCommunityUserByCommunityRole() {
		if (this.allCommunityUser.length > 0) {
			this.filteredCommunityUser = this.allCommunityUser.filter(row => row.roleid == Number(this.CommunityRoleIdForAdding));
		}
		this.CommunityUserIdForAdding = this.filteredCommunityUser[0].id;
	}

	getFacilityUserByFacilityRole() {
		if (this.allFacilityUser.length > 0) {
			this.filteredFacilityUser = this.allFacilityUser.filter(row => row.roleid == Number(this.FacilityRoleIdForAdding));
		}
		this.FacilityUserIdForAdding = this.filteredFacilityUser[0].id;
	}





	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.Property && this.Property.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Property '${this.Property.address}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Property';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.Property && this.Property.address.length > 0);
		// return (this.Property && this.Property.companyid > 0);
	}

	//Load MainMenu
	getAllAminities() {
		this.auth.GetAllAminities().subscribe((_aminities: AminitiesModel[]) => {
			console.log('GetAllAminities collection:: Response::' + JSON.stringify(_aminities));
			this.aminitiesCollection = _aminities;
		});
	}

	//Load Neighbour Category
	getAllNeighbourCategory() {
		this.auth.GetALLNeighbourhoodCategory().subscribe((_neighbourcategory: NeighbourhoodCategoryModel[]) => {
			console.log('getAllNeighbourCategory collection:: Response::' + JSON.stringify(_neighbourcategory));
			this.neighbourcategoryCollection = _neighbourcategory;
		});
	}
	getAllNeighbourTypeCollection() {
		this.auth.GetAllAminitiesNeighbourhood().subscribe((_NeighbourType: AminitiesNeighbourhoodModel[]) => {
			console.log('getAllNeighbourTypeCollection collection:: Response::' + JSON.stringify(_NeighbourType));
			this.neighbourTypeCollection = _NeighbourType;
		});
	}
	getAllNeighbourTypeCollectionbyAID(nid: number): AminitiesNeighbourhoodModel[] {
		return this.neighbourTypeCollectionByNID = this.neighbourTypeCollection.filter(row => row.neighbourhoodcategoryid == nid);

	}


	getAllAminitiesType() {
		this.auth.GetAllAminitiesType().subscribe((_AminitiesType: AminitiesTypeModel[]) => {
			console.log('GetAllAminitiesType collection:: Response::' + JSON.stringify(_AminitiesType));
			this.aminitiesTypeCollection = _AminitiesType;
		});
	}
	getAllAminitiesTypebyAID(amenitiesid: number): AminitiesTypeModel[] {
		return this.aminitiesTypeCollectionByID = this.aminitiesTypeCollection.filter(row => row.aminitiesid == amenitiesid);

	}


	ischecked: any[] = [];
	VaildateAminitiesType(aminitiesid: number, aminitietypeid: number): boolean {
		this.ischecked = this.selectedAminitsTypeList.filter(row => row.aminitiesid == aminitiesid && row.aminitiestypeid == aminitietypeid);
		if (this.ischecked.length > 0) {
			return true;
		}
		else
			return false;
	}

	isNeighbourchecked: any[] = [];
	VaildateNeighbourType(neighbourcategoryid: number, neighbourtypeid: number): boolean {
		this.isNeighbourchecked = this.selectedPropertyNeighbourTypeList.filter(row => row.PropertyNeighbourCategoryid == neighbourcategoryid && row.PropertyNeighbourTypeid == neighbourtypeid);
		if (this.isNeighbourchecked.length > 0) 
			return true;		
		else
			return false;
	}


	deleteImages($event, propertyImages: PropertyImagesModel) {
		const index = this.editselectedImagesList.findIndex(
			x => x.propertyid == propertyImages.propertyid
				&& x.imagename == propertyImages.imagename
				&& x.showimagepath == propertyImages.showimagepath
				&& x.imagepath == propertyImages.imagepath);
		this.editselectedImagesList.splice(index, 1);
	}
	
	UpadtePropertyImages() {
		this.auth.updatePropertyImages(this.editselectedImagesList).subscribe(
			data => {
			}
		);
	}

	urls = [];
	myFiles: string[] = [];
	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var filesAmount = event.target.files.length;
			for (let i = 0; i < filesAmount; i++) {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					console.log(event.target.result);
					this.urls.push(event.target.result);
				}
				this.myFiles.push(event.target.files[i]);
				reader.readAsDataURL(event.target.files[i]);
			}
		}
	}

	uploadFiles(propertyid: number): PropertyImagesModel[] {

		if (propertyid == undefined)
			propertyid = 0;
		const frmData = new FormData();
		for (var i = 0; i < this.myFiles.length; i++) {
			frmData.append("fileUpload" + i + '-' + propertyid, this.myFiles[i]);
		}

		this.auth.UploadImages(frmData).subscribe((_PropertyImagesModel: PropertyImagesModel[]) => {
			this.selectedImagesList = _PropertyImagesModel;
			if (_PropertyImagesModel.length > 0) {
				for (let i = 0; i < _PropertyImagesModel.length; i++) {
					this.ImagesList = {
						imagename: _PropertyImagesModel[i].imagename,
						imagepath: _PropertyImagesModel[i].imagepath,
						propertyid: _PropertyImagesModel[i].propertyid,
						showimagepath: _PropertyImagesModel[i].showimagepath,
					}
					this.editselectedImagesList.push(this.ImagesList)
				}
				this.UpadtePropertyImages();
				console.log('Uploaded Images::' + JSON.stringify(this.editselectedImagesList))
			}
			else {
				this.UpadtePropertyImages();
			}
		});


		return this.editselectedImagesList;
	}
}

