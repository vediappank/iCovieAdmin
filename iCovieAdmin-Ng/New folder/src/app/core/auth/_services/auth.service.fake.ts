// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../../environments/environment';
// CRUD
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../../_base/crud';
// Models
import { User } from '../_models/MAdministrator/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/MAdministrator/role.model';
import { privilege } from '../_models/privilege.model';
import { ChangePasswordModel } from '../../../views/pages/userprofile/_model/changepasswordrequest.model';

//Master

import { MDepartmentModel } from '../_models/Master/mdepartment.model';
import { MApproverModel } from '../_models/Master/mapprover.model';
import { MLevelModel } from '../_models/Master/mlevel.model';
import { MPriorityModel } from '../_models/Master/mpriority.model';
import { MStatusModel } from '../_models/Master/mstatus.model';
import { MSubCategoryModel } from '../_models/Master/msubcategory.model';
import { MTaskTypeModel } from '../_models/Master/mtasktype.model';
import { MVendorModel } from '../_models/Master/mvendor.model';
import {DashLocationRequest} from '../../../views/pages/dashboard/_models/dashlocationrequest.model';

import { MCompanyModel } from '../_models/MFacilities/mcompany.model';
import { MLocationModel } from '../_models/MFacilities/mlocation.model';
import { MBuildingModel } from '../_models/MFacilities/mbuilding.model';
import { MFloorModel } from '../_models/MFacilities/mfloor.model';
import { MWingModel } from '../_models/MFacilities/mwing.model';

import { MCityModel } from '../_models/MGeograpical/mcity.model';
import { MCityImagesModel } from '../_models/MGeograpical/mcityimages.model';
import { MCountryModel } from '../_models/MGeograpical/mcountry.model';
import { MRegionModel } from '../_models/MGeograpical/mregion.model'
import { MStateModel } from '../_models/MGeograpical/mstate.model'
import { MTimeZoneModel } from '../_models/MGeograpical/mtimezone.model';

import { AminitiesModel } from '../_models/Masters/aminities.model';
import { AminitiesNeighbourhoodModel } from '../_models/Masters/aminitiesneighbourhood.model';
import { AminitiesTypeModel } from '../_models/Masters/aminitiestype.model';
import { BedTypeModel } from '../_models/Masters/bedtype.model';
import { BusinessCategoryModel } from '../_models/Masters/businesscategory.model';
import { GuestTypeModel } from '../_models/Masters/guesttype.model';
import { PropertyModel } from '../_models/Masters/Property.model';
import { PropertyCategoryModel } from '../_models/Masters/propertycategory.model';
import { PropertyTypeModel } from '../_models/Masters/propertytype.model';
import { SignupModel } from '../_models/Masters/signup.model';
import { WingTypeModel } from '../_models/Masters/wingtype.model';
import { GenderModel } from '../_models/Masters/gender.model';
import { UpdatePropertyImagesModel } from '../_models/Masters/updateimages.model';
import { PropertyImagesModel } from '../_models/Masters/propertyimages.model';
import { UpdatePropertyImagesRequestModel } from '../_models/Masters/uploadimagesrequest.model';
import { NeighbourhoodCategoryModel } from '../_models/Masters/NeighbourhoodCategory.model';

// import {
// 	PropertyModel,
// 	MCompanyModel,
// 	AminitiesModel,
// 	AminitiesTypeModel,
// 	PropertyImagesModel,
// 	PropertyAminitiesModel,
// 	Permission,
// 	selectPropertyById,
// 	PropertyUpdated,
// 	selectAllPermissions,
// 	selectAllPropertys,

// 	selectLastCreatedPropertyId,
// 	PropertyOnServerCreated,
// 	MLocationModel,
// 	MBuildingModel,
// 	MFloorModel,
// 	MWingModel,
// 	UpdatePropertyImagesModel,
// 	Role,
// 	User
// } from '../../../core/auth';


const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

@Injectable()
export class AuthService {
    
    public isTokenFlag: boolean = false;
    public Token: any;
    public PostToken: any;
    baseUrl = environment.baseUrl;
    CompanyID: any;
    LocationID: any;
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService, private router: Router, ) {

    }
    private _items:any[] = [];
 
    addItem(item: any) {
        this._items=[];
        this._items.push(item);
        console.log('Set Current Company / Location ID::::' + JSON.stringify(this._items));
    }
 
    getItems(): any[] {   
        console.log('Get Current Company / Location ID::::' + JSON.stringify(this._items));  
        return this._items;
        
    }

    // Authentication/Authorization
    login(username: string, password: string): Observable<User> {
        if (!username || !password) {
            return of(null);
        }
        var data = "grant_type=password&username=" + username + "&password=" + password;
        return this.http.post<User>(this.baseUrl + '/token', data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    }

    verify(): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/covieadmin/Verify', { headers: this.Token }).pipe(catchError(this.handleError));
    }

   

    //UserProfile
    GetChangePassword(req: ChangePasswordModel): Observable<any> {
        if (this.hasPostTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/covieadmin/ChangePassword', req, this.PostToken).pipe(catchError(this.handleError));
    }
    //UserProfile

   

    
    //End Dashboard Services


    register(user: User): Observable<any> {
        user.userroleid = [2]; // Manager
        user.refreshToken = 'access-token-' + Math.random();

        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
            .pipe(
                map((res: User) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    requestPassword(email: string): Observable<any> {
        return this.http.get(API_USERS_URL).pipe(
            map((users: User[]) => {
                if (users.length <= 0) {
                    return null;
                }
                const user = find(users, function (item: User) {
                    return (item.email.toLowerCase() === email.toLowerCase());
                });
                if (!user) {
                    return null;
                }
                user.password = undefined;
                return user;
            }),
            catchError(this.handleError('forgot-password', []))
        );
    }

    getUserByToken(): Observable<User> {
        try {          
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            // alert('getUserByToken services:::'+ currentUser.token);
            if (!currentUser.token) {
                return of(null);
            }
            return this.getUserById(currentUser.agentid).pipe(
                map((result: User) => {                   
                    // alert('inside<<<<<<<'+ currentUser.token);
                    return result;
                })
            );
        }
        catch (ex) {
            // alert('exception:::'+ ex);
        }
    }

    // Users

    // CREATE =>  POST: add a new user to the server
    // createUser(user: User): Observable<User> {
    //     const httpHeaders = new HttpHeaders();
    //     // Note: Add headers if needed (tokens/bearer)
    //     httpHeaders.set('Content-Type', 'application/json');
    //     return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders });
    // }

    // READ




    // DELETE => delete the user from the server
    



    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls       

        return this.getAllUsers().pipe(           
            mergeMap((response: User[]) => {              
                let userSelectedlist:User[];
                //userSelectedlist = response.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                userSelectedlist = response;
                const result = this.httpUtils.baseFilter(userSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    // Permissions
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        const allRolesRequest = this.http.get<Permission[]>(API_PERMISSION_URL);
        const roleRequest = roleId ? this.getRoleById(roleId) : of(null);
        return forkJoin(allRolesRequest, roleRequest).pipe(
            map(res => {
                const _allPermissions: Permission[] = res[0];
                const _role: Role = res[1];
                if (!_allPermissions || _allPermissions.length === 0) {
                    return [];
                }

                const _rolePermission = _role ? _role.permissions : [];
                //const result: Permission[] = this.getRolePermissionsTree(_allPermissions, _rolePermission);
                return;
            })
        );
    }

    private getRolePermissionsTree(_allPermission: Permission[] = [], _rolePermissionIds: number[] = []): Permission[] {
        const result: Permission[] = [];
        const _root: Permission[] = filter(_allPermission, (item: Permission) => !item.parentId);
        each(_root, (_rootItem: Permission) => {
            _rootItem._children = [];
            _rootItem._children = this.collectChildrenPermission(_allPermission, _rootItem.id, _rolePermissionIds);
            _rootItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _rootItem.id));
            result.push(_rootItem);
        });
        return result;
    }

    private collectChildrenPermission(_allPermission: Permission[] = [],
        _parentId: number, _rolePermissionIds: number[] = []): Permission[] {
        const result: Permission[] = [];
        const _children: Permission[] = filter(_allPermission, (item: Permission) => item.parentId === _parentId);
        if (_children.length === 0) {
            return result;
        }

        each(_children, (_childItem: Permission) => {
            _childItem._children = [];
            _childItem._children = this.collectChildrenPermission(_allPermission, _childItem.id, _rolePermissionIds);
            _childItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _childItem.id));
            result.push(_childItem);
        });
        return result;
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        if (this.hasTokenProperty()) {
            return this.http.get<Role[]>(this.baseUrl + '/api/covieadmin/GetRole', { headers: this.Token });
            // return this.http.get<Role[]>(API_ROLES_URL);
        }
    }

    getRoleById(roleId: number): Observable<Role> {
        return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }
    // DELETE => delete the role from the server
    // deleteRole(roleId: number): Observable<Role> {
    //     const url = `${API_ROLES_URL}/${roleId}`;
    //     return this.http.delete<Role>(url);
    // }

   
    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        if (this.hasTokenProperty()) {        
            return this.http.get<Role[]>(this.baseUrl + '/api/covieadmin/GetRole', { headers: this.Token }).pipe(
                mergeMap(res => {               
                let roleSelectedlist:Role[];               
                //roleSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                roleSelectedlist = res;
                    const result = this.httpUtils.baseFilter(roleSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    }

    //UploadImages
    //UploadImages(fileToUpload:UpdatePropertyImagesRequestModel): Observable<PropertyImagesModel[]> {
        UploadImages(fileToUpload:FormData): Observable<PropertyImagesModel[]> {
        
        this.PostToken = {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
                'Content-Type': 'application/json'
            }
        };
       return this.http.post<PropertyImagesModel[]>(this.baseUrl + '/api/covieadmin/AddImage', fileToUpload,{ headers: this.PostToken });
        
    }
    updateCityImages(City: MCityImagesModel[]): Observable<any> {        
        var propertyID=  this.http.post(this.baseUrl + '/api/covieadmin/UpdateCityImages', City,{ headers: this.PostToken });
        return propertyID;
    }
    AddCityImage(fileToUpload:FormData): Observable<MCityImagesModel[]> {
        
        this.PostToken = {
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
                'Content-Type': 'application/json'
            }
        };
       return this.http.post<MCityImagesModel[]>(this.baseUrl + '/api/covieadmin/AddCityImage', fileToUpload,{ headers: this.PostToken });
        
    }
 

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.getAllUsers().pipe(
            map((users: User[]) => {
                if (some(users, (user: User) => some(user.userroleid, (_roleId: number) => _roleId === roleId))) {
                    return true;
                }

                return false;
            })
        );
    }

    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }

    hasTokenProperty() {
        if (localStorage.hasOwnProperty('currentUser')) {
            this.Token = { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token };
            this.isTokenFlag = true;
            return this.isTokenFlag;
        }
        return false;
    }

    hasPostTokenProperty() {
        if (localStorage.hasOwnProperty('currentUser')) {
            this.PostToken = {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token,
                    'Content-Type': 'application/json'
                }
            };
            this.isTokenFlag = true;
            return this.isTokenFlag;
        }
        return false;
    }

    

    //#region 
     //Geograpical Master 

     //TimeZone
    GetALLTimeZone(): Observable<MTimeZoneModel[]> {     
        console.log('response Data before:::');   
       var data= this.http.get<MTimeZoneModel[]>(this.baseUrl + '/api/covieadmin/GetAllTimeZone',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findTimeZone(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findTimeZone:::');   
        // This code imitates server calls
        return this.http.get<MTimeZoneModel[]>(this.baseUrl + '/api/covieadmin/GetAllTimeZone',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let TimeZoneelectedlist:MTimeZoneModel[];              
                // TimeZoneelectedlist = res.filter(row=>row.TimeZoneid.toString() == this.resultFilterByTimeZone());
              
                TimeZoneelectedlist = res;
                const result = this.httpUtils.baseFilter(TimeZoneelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createTimeZone(TimeZone: MTimeZoneModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertTimeZone', TimeZone,{ headers: this.PostToken });
    }

    updateTimeZone(TimeZone: MTimeZoneModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateTimeZone', TimeZone,{ headers: this.PostToken });
    }

    deleteTimeZone(TimeZoneid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteTimeZone?TimeZoneID=' + TimeZoneid,{ headers: this.PostToken });
    }

    GetALLNeighbourhoodCategory(): Observable<NeighbourhoodCategoryModel[]> {     
        console.log('response Data before:::');   
       var data= this.http.get<NeighbourhoodCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllNeighbourhood_category',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findNeighbourhoodCategory(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findNeighbourhoodCategory:::');   
        // This code imitates server calls
        return this.http.get<NeighbourhoodCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllNeighbourhood_category',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let NeighbourhoodCategoryelectedlist:NeighbourhoodCategoryModel[];              
                // NeighbourhoodCategoryelectedlist = res.filter(row=>row.NeighbourhoodCategoryid.toString() == this.resultFilterByNeighbourhoodCategory());
              
                NeighbourhoodCategoryelectedlist = res;
                const result = this.httpUtils.baseFilter(NeighbourhoodCategoryelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createNeighbourhoodCategory(NeighbourhoodCategory: NeighbourhoodCategoryModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertNeighbourhood_category', NeighbourhoodCategory,{ headers: this.PostToken });
    }

    updateNeighbourhoodCategory(NeighbourhoodCategory: NeighbourhoodCategoryModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateNeighbourhood_category', NeighbourhoodCategory,{ headers: this.PostToken });
    }

    deleteNeighbourhoodCategory(NeighbourhoodCategoryid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteNeighbourhood_category?Neighbourhood_categoryID=' + NeighbourhoodCategoryid,{ headers: this.PostToken });
    }
    //#endregion
    
      //Region
      GetALLRegion(): Observable<MRegionModel[]> {     
        console.log('response Data before:::');   
       var data= this.http.get<MRegionModel[]>(this.baseUrl + '/api/covieadmin/GetAllRegion',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findRegion(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findRegion:::');   
        // This code imitates server calls
        return this.http.get<MRegionModel[]>(this.baseUrl + '/api/covieadmin/GetAllRegion',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let Regionelectedlist:MRegionModel[];              
                // Regionelectedlist = res.filter(row=>row.Regionid.toString() == this.resultFilterByRegion());
              
                Regionelectedlist = res;
                const result = this.httpUtils.baseFilter(Regionelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createRegion(Region: MRegionModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertRegion', Region,{ headers: this.PostToken });
    }

    updateRegion(Region: MRegionModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateRegion', Region,{ headers: this.PostToken });
    }

    deleteRegion(Regionid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteRegion?RegionID=' + Regionid,{ headers: this.PostToken });
    }

    //Country
    GetALLCountry(): Observable<MCountryModel[]> {     
       // alert('response Data before:::');   
       var data= this.http.get<MCountryModel[]>(this.baseUrl + '/api/covieadmin/GetAllCountry',{ headers: this.PostToken });
       console.log('GetAllCountry response Data:::'+JSON.stringify(data));
       
    return data;
    }
    findCountry(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
        //alert('response Data before:::');   
        console.log('response Data before findCountry:::');   
        // This code imitates server calls
        return this.http.get<MCountryModel[]>(this.baseUrl + '/api/covieadmin/GetAllCountry',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let Countryelectedlist:MCountryModel[];              
                // Countryelectedlist = res.filter(row=>row.Countryid.toString() == this.resultFilterByCountry());
              
                Countryelectedlist = res;
                const result = this.httpUtils.baseFilter(Countryelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createCountry(Country: MCountryModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertCountry', Country,{ headers: this.PostToken });
    }

    updateCountry(Country: MCountryModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateCountry', Country,{ headers: this.PostToken });
    }

    deleteCountry(Countryid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteCountry?CountryID=' + Countryid,{ headers: this.PostToken });
    }

    //State
    GetALLState(): Observable<MStateModel[]> {     
        console.log('response Data before:::');   
       var data= this.http.get<MStateModel[]>(this.baseUrl + '/api/covieadmin/GetAllState',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findState(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findState:::');   
        // This code imitates server calls
        return this.http.get<MStateModel[]>(this.baseUrl + '/api/covieadmin/GetAllState',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let Stateelectedlist:MStateModel[];              
                // Stateelectedlist = res.filter(row=>row.Stateid.toString() == this.resultFilterByState());
              
                Stateelectedlist = res;
                const result = this.httpUtils.baseFilter(Stateelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createState(State: MStateModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertState', State,{ headers: this.PostToken });
    }

    updateState(State: MStateModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateState', State,{ headers: this.PostToken });
    }

    deleteState(Stateid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteState?StateID=' + Stateid,{ headers: this.PostToken });
    }
    

     //City
     GetALLCity(): Observable<MCityModel[]> {     
        console.log('response Data before:::');   
       var data= this.http.get<MCityModel[]>(this.baseUrl + '/api/covieadmin/GetAllCity',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findCity(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findCity:::');   
        // This code imitates server calls
        return this.http.get<MCityModel[]>(this.baseUrl + '/api/covieadmin/GetAllCity',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let Cityelectedlist:MCityModel[];              
                // Cityelectedlist = res.filter(row=>row.Cityid.toString() == this.resultFilterByCity());
              
                Cityelectedlist = res;
                const result = this.httpUtils.baseFilter(Cityelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createCity(City: MCityModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertCity', City,{ headers: this.PostToken });
    }

    updateCity(City: MCityModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateCity', City,{ headers: this.PostToken });
    }

    deleteCity(Cityid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteCity?CityID=' + Cityid,{ headers: this.PostToken });
    }

  

  
    //#endregion
    

   

    GetALLLocation(): Observable<any[]> {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetAllLocation', { headers: this.Token }).pipe(catchError(this.handleError));
    }

    updateUser(_user: User): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/covieadmin/UpdateUser', _user, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    createRole(role: Role): Observable<any> {     
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/covieadmin/RoleMainMenuMappingInsert', role, this.PostToken).pipe(catchError(this.handleError));
    }

    updateRole(role: Role): Observable<any> {      
        if (this.hasPostTokenProperty())
            return this.http.post(this.baseUrl + '/api/covieadmin/RoleMainMenuMappingUpdate', role, this.PostToken).pipe(catchError(this.handleError));
    }
    deleteRole(role_id: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteRole?role_id=' + role_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    deleteUser(user_id: number) {
        if (this.hasTokenProperty())
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteUser?user_id=' + user_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetAllTaskDescription(renovation_id: number, renovation_task_id:Number): Observable<any>  {
        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/covieadmin/GetAllTaskDescription?i_renovation_task_id=' + renovation_task_id+'&i_renovation_id='+renovation_id, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    createUser(_user: User): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/covieadmin/InsertUser', _user, { headers: this.Token }).pipe(catchError(this.handleError));
    }

    getRoleCollection(): Observable<any> {
        if (this.hasTokenProperty()) {
            return this.http.get(this.baseUrl + '/api/covieadmin/GetRole', { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }

    getAllUsers(): Observable<User[]> {
        if (this.hasTokenProperty())
            return this.http.get<User[]>(this.baseUrl + '/api/covieadmin/GetAllUser', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    getUserById(userId: number): Observable<User> {
        if (this.hasTokenProperty())
            return this.http.get<User>(this.baseUrl + '/api/covieadmin/GetUser?UserId=' + userId, { headers: this.Token });
    }

    
    GetAllMainMenu(roleid: number): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.get<any>(this.baseUrl + '/api/covieadmin/GetAllMainMenu?role_id=' + roleid, { headers: this.Token }).pipe(catchError(this.handleError));
    }
   
    GetAllPrivileges(): Observable<privilege[]> {
        if (this.hasTokenProperty())
            return this.http.get<privilege[]>(this.baseUrl + '/api/covieadmin/GetAllPrivileges', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetMenuConfig(): Observable<any> {
        
        if (this.hasTokenProperty()) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return this.http.get<any>(this.baseUrl + '/api/covieadmin/GetMenuConfig?role_id=' + currentUser.role_id, { headers: this.Token }).pipe(catchError(this.handleError));
        }
    }

    resultFilterByCompany():string
    {       
        let getCompanyLocation = this.getItems();
        return this.CompanyID = getCompanyLocation[0].CompanyID;
    }

    resultFilterByLocation():string
    {
        let getCompanyLocation = this.getItems();
        return this.LocationID = getCompanyLocation[0].LocationID;
    }

    GetRenovationCount():Observable<any>
    {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetRenovationCount', { headers: this.Token }).pipe(catchError(this.handleError));
    }
    GetRenovationTaskCount():Observable<any>
    {
        if (this.hasTokenProperty())
            return this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetRenovationTaskCount', { headers: this.Token }).pipe(catchError(this.handleError));
    }
//#region Dashboard
    GetDashLocationDetails(_dashlocation: DashLocationRequest): Observable<any> {
        if (this.hasTokenProperty())
            return this.http.post<any>(this.baseUrl + '/api/covieadmin/GetDashLocationReport', _dashlocation, { headers: this.Token }).pipe(catchError(this.handleError));
    }

   

    //Location
    GetAllLocation(): Observable<MLocationModel[]> { 
     
        console.log('response Data before:::');   
       var data= this.http.get<MLocationModel[]>(this.baseUrl + '/api/covieadmin/GetAllLocation',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findLocation(queryParams: QueryParamsModel): Observable<QueryResultsModel> {  
      
        console.log('response Data before findLocation:::');   
        // This code imitates server calls
       
        return this.http.get<MLocationModel[]>(this.baseUrl + '/api/covieadmin/GetAllLocation',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                
                let Locationelectedlist:MLocationModel[];              
                // Locationelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
              
                Locationelectedlist = res;
                const result = this.httpUtils.baseFilter(Locationelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createLocation(Location: MLocationModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertLocation', Location,{ headers: this.PostToken });
    }

    updateLocation(Location: MLocationModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateLocation', Location,{ headers: this.PostToken });
    }

    deleteLocation(Locationid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteLocation?LocationID=' + Locationid,{ headers: this.PostToken });
    }

    //Company
    // GetALLCompany(): Observable<any[]> {
    //     if (this.hasTokenProperty())
    //         return this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetAllCompany', { headers: this.Token }).pipe(catchError(this.handleError));
    // }
    GetALLCompany(): Observable<MCompanyModel[]> { 
    
        console.log('response Data before:::');   
      // var data= this.http.get<MCompanyModel[]>(this.baseUrl + '/api/covieadmin/GetAllCompany?cityID='+cityID,{ headers: this.PostToken });
      var data= this.http.get<MCompanyModel[]>(this.baseUrl + '/api/covieadmin/GetAllCompany',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findCompany(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
        console.log('response Data before findCompany:::');   
        // This code imitates server calls
        return this.http.get<MCompanyModel[]>(this.baseUrl + '/api/covieadmin/GetAllCompany',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                
                let Companyelectedlist:MCompanyModel[];              
                // Companyelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
              
                Companyelectedlist = res;
                const result = this.httpUtils.baseFilter(Companyelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createCompany(Company: MCompanyModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertCompany', Company,{ headers: this.PostToken });
    }

    updateCompany(Company: MCompanyModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateCompany', Company,{ headers: this.PostToken });
    }

    deleteCompany(Companyid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteCompany?CompanyID=' + Companyid,{ headers: this.PostToken });
    }

    

    GetALLBuilding(): Observable<MBuildingModel[]> { 
    
        console.log('response Data before:::');   
       var data= this.http.get<MBuildingModel[]>(this.baseUrl + '/api/covieadmin/GetAllBuilding',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findBuilding(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
      
        console.log('response Data before findBuilding:::');   
        // This code imitates server calls
        return this.http.get<MBuildingModel[]>(this.baseUrl + '/api/covieadmin/GetAllBuilding',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
              
                let Buildingelectedlist:MBuildingModel[];              
                // Buildingelectedlist = res.filter(row=>row.Buildingid.toString() == this.resultFilterByBuilding());
              
                Buildingelectedlist = res;
                const result = this.httpUtils.baseFilter(Buildingelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createBuilding(Building: MBuildingModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertBuilding', Building,{ headers: this.PostToken });
    }

    updateBuilding(Building: MBuildingModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateBuilding', Building,{ headers: this.PostToken });
    }

    deleteBuilding(Buildingid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteBuilding?BuildingID=' + Buildingid,{ headers: this.PostToken });
    }

    GetALLFloor(): Observable<MFloorModel[]> { 
    
        console.log('response Data before:::');   
       var data= this.http.get<MFloorModel[]>(this.baseUrl + '/api/covieadmin/GetAllFloor',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findFloor(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
        console.log('response Data before findFloor:::');   
        // This code imitates server calls
        return this.http.get<MFloorModel[]>(this.baseUrl + '/api/covieadmin/GetAllFloor',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                
                let Floorelectedlist:MFloorModel[];              
                // Floorelectedlist = res.filter(row=>row.Floorid.toString() == this.resultFilterByFloor());
              
                Floorelectedlist = res;
                const result = this.httpUtils.baseFilter(Floorelectedlist, queryParams, []);
                
                return of(result);
            })
        );
    }

    createFloor(Floor: MFloorModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertFloor', Floor,{ headers: this.PostToken });
    }

    updateFloor(Floor: MFloorModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateFloor', Floor,{ headers: this.PostToken });
    }

    deleteFloor(Floorid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteFloor?FloorID=' + Floorid,{ headers: this.PostToken });
    }

    GetALLWing(): Observable<MWingModel[]> { 
    
        console.log('response Data before:::');   
       var data= this.http.get<MWingModel[]>(this.baseUrl + '/api/covieadmin/GetAllUnit',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findWing(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
        console.log('response Data before findWing:::');   
        // This code imitates server calls
        return this.http.get<MWingModel[]>(this.baseUrl + '/api/covieadmin/GetAllUnit',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                
                let Wingelectedlist:MWingModel[];              
                // Wingelectedlist = res.filter(row=>row.Wingid.toString() == this.resultFilterByWing());
              
                Wingelectedlist = res;
                const result = this.httpUtils.baseFilter(Wingelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createWing(Wing: MWingModel): Observable<any> { 
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertUnit', Wing,{ headers: this.PostToken });
    }

    updateWing(Wing: MWingModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateUnit', Wing,{ headers: this.PostToken });
    }

    deleteWing(Wingid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteUnit?UnitID=' + Wingid,{ headers: this.PostToken });
    }
    //#endregion

    //#region 
    GetReportRenovation(startdate:string, enddate:string,compnayid:number, locationid:number,renovationid:number): Observable<any[]> {      
        console.log('response Data before:::');   
       var data= this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetAllRenovationForReports?startdate='+ startdate+'&enddate='+enddate+'&companyid='+compnayid+'&locationid='+locationid+'&rid='+renovationid,{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }

    GetStage(): Observable<any[]> {
        console.log('response Data before:::');   
      return this.http.get<any[]>(this.baseUrl + '/api/covieadmin/GetAllStage',{ headers: this.PostToken });
      
    }
    //#endregion

    

      //Aminities
      GetAllAminities(): Observable<AminitiesModel[]> {      
        console.log('response Data before:::');   
        return this.http.get<AminitiesModel[]>(this.baseUrl + '/api/covieadmin/GetAllAminities',{ headers: this.PostToken });
      // console.log('response Data:::'+JSON.stringify(data));
    //return data;
    }
    findAminities(queryParams: QueryParamsModel): Observable<QueryResultsModel> {      
        console.log('response Data before findAminities:::');   
        // This code imitates server calls
        
        return this.http.get<AminitiesModel[]>(this.baseUrl + '/api/covieadmin/GetAllAminities',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let categorySelectedlist:AminitiesModel[];              
                //categorySelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                categorySelectedlist = res;
                const result = this.httpUtils.baseFilter(categorySelectedlist, queryParams, []);               
                return of(result);
            })
        );
    }

    createAminities(Aminities: AminitiesModel): Observable<any> {  
            
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertAminities', Aminities,{ headers: this.PostToken });
    }

    updateAminities(Aminities: AminitiesModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateAminities', Aminities,{ headers: this.PostToken });
    }

    deleteAminities(Aminitiesid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteAminities?AminitiesID=' + Aminitiesid,{ headers: this.PostToken });
    }

        //AminitiesNeighbourhood
        GetAllAminitiesNeighbourhood(): Observable<AminitiesNeighbourhoodModel[]> {    
  
            console.log('response Data before:::');   
           var data= this.http.get<AminitiesNeighbourhoodModel[]>(this.baseUrl + '/api/covieadmin/GetAllNeighbourhoodType',{ headers: this.PostToken });
           console.log('response Data:::'+JSON.stringify(data));
        return data;
        }
        findAminitiesNeighbourhood(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
                   
            console.log('response Data before findAminitiesNeighbourhood:::');   
            // This code imitates server calls
            return this.http.get<AminitiesNeighbourhoodModel[]>(this.baseUrl + '/api/covieadmin/GetAllNeighbourhoodType',{ headers: this.PostToken }).pipe(
                mergeMap(res => {
                    let departmentSelectedlist:AminitiesNeighbourhoodModel[];              
                    //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                    departmentSelectedlist = res;
                    const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    
        createAminitiesNeighbourhood(AminitiesNeighbourhood: AminitiesNeighbourhoodModel): Observable<any> { 
                
                return this.http.post(this.baseUrl + '/api/covieadmin/InsertNeighbourhoodType', AminitiesNeighbourhood,{ headers: this.PostToken });
        }
    
        updateAminitiesNeighbourhood(AminitiesNeighbourhood: AminitiesNeighbourhoodModel): Observable<any> {        
                return this.http.post(this.baseUrl + '/api/covieadmin/UpdateNeighbourhoodType', AminitiesNeighbourhood,{ headers: this.PostToken });
        }
    
        deleteAminitiesNeighbourhood(AminitiesNeighbourhoodid: number): Observable<any> {        
                return this.http.get(this.baseUrl + '/api/covieadmin/DeleteNeighbourhoodType?AminitiesNeighbourhoodID=' + AminitiesNeighbourhoodid,{ headers: this.PostToken });
        }

            //AminitiesType
    GetAllAminitiesType(): Observable<AminitiesTypeModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<AminitiesTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllAminitiesType',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findAminitiesType(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findAminitiesType:::');   
        // This code imitates server calls
        return this.http.get<AminitiesTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllAminitiesType',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let departmentSelectedlist:AminitiesTypeModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                departmentSelectedlist = res;
                const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createAminitiesType(AminitiesType: AminitiesTypeModel): Observable<any> { 
            
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertAminitiesType', AminitiesType,{ headers: this.PostToken });
    }

    updateAminitiesType(AminitiesType: AminitiesTypeModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateAminitiesType', AminitiesType,{ headers: this.PostToken });
    }

    deleteAminitiesType(AminitiesTypeid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteAminitiesType?AminitiesTypeID=' + AminitiesTypeid,{ headers: this.PostToken });
    }

        //BedType
        GetAllBedType(): Observable<BedTypeModel[]> {    
  
            console.log('response Data before:::');   
           var data= this.http.get<BedTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllBedType',{ headers: this.PostToken });
           console.log('response Data:::'+JSON.stringify(data));
        return data;
        }
        findBedType(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
                   
            console.log('response Data before findBedType:::');   
            // This code imitates server calls
            return this.http.get<BedTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllBedType',{ headers: this.PostToken }).pipe(
                mergeMap(res => {
                    let departmentSelectedlist:BedTypeModel[];              
                    //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                    departmentSelectedlist = res;
                    const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    
        createBedType(BedType: BedTypeModel): Observable<any> { 
                
                return this.http.post(this.baseUrl + '/api/covieadmin/InsertBedType', BedType,{ headers: this.PostToken });
        }
    
        updateBedType(BedType: BedTypeModel): Observable<any> {        
                return this.http.post(this.baseUrl + '/api/covieadmin/UpdateBedType', BedType,{ headers: this.PostToken });
        }
    
        deleteBedType(BedTypeid: number): Observable<any> {        
                return this.http.get(this.baseUrl + '/api/covieadmin/DeleteBedType?BedTypeID=' + BedTypeid,{ headers: this.PostToken });
        }

            //BusinessCategory
    GetAllBusinessCategory(): Observable<BusinessCategoryModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<BusinessCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllBusinessCategory',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findBusinessCategory(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findBusinessCategory:::');   
        // This code imitates server calls
        return this.http.get<BusinessCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllBusinessCategory',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let departmentSelectedlist:BusinessCategoryModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                departmentSelectedlist = res;
                const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createBusinessCategory(BusinessCategory: BusinessCategoryModel): Observable<any> { 
            
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertBusinessCategory', BusinessCategory,{ headers: this.PostToken });
    }

    updateBusinessCategory(BusinessCategory: BusinessCategoryModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateBusinessCategory', BusinessCategory,{ headers: this.PostToken });
    }

    deleteBusinessCategory(BusinessCategoryid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteBusinessCategory?BusinessCategoryID=' + BusinessCategoryid,{ headers: this.PostToken });
    }

        //GuestType
        GetAllGuestType(): Observable<GuestTypeModel[]> {    
  
            console.log('response Data before:::');   
           var data= this.http.get<GuestTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllGuestType',{ headers: this.PostToken });
           console.log('response Data:::'+JSON.stringify(data));
        return data;
        }
        findGuestType(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
                   
            console.log('response Data before findGuestType:::');   
            // This code imitates server calls
            return this.http.get<GuestTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllGuestType',{ headers: this.PostToken }).pipe(
                mergeMap(res => {
                    let departmentSelectedlist:GuestTypeModel[];              
                    //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                    departmentSelectedlist = res;
                    const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    
        createGuestType(GuestType: GuestTypeModel): Observable<any> { 
                
                return this.http.post(this.baseUrl + '/api/covieadmin/InsertGuestType', GuestType,{ headers: this.PostToken });
        }
    
        updateGuestType(GuestType: GuestTypeModel): Observable<any> {        
                return this.http.post(this.baseUrl + '/api/covieadmin/UpdateGuestType', GuestType,{ headers: this.PostToken });
        }
    
        deleteGuestType(GuestTypeid: number): Observable<any> {        
                return this.http.get(this.baseUrl + '/api/covieadmin/DeleteGuestType?GuestTypeID=' + GuestTypeid,{ headers: this.PostToken });
        }

            //Property
    GetAllProperty(): Observable<PropertyModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<PropertyModel[]>(this.baseUrl + '/api/covieadmin/GetAllProperty',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findProperty(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findProperty:::');   
        // This code imitates server calls
        return this.http.get<PropertyModel[]>(this.baseUrl + '/api/covieadmin/GetAllProperty',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let departmentSelectedlist:PropertyModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                departmentSelectedlist = res;
                const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createProperty(Property: PropertyModel): Observable<any> {            
            
            var propertyID= this.http.post(this.baseUrl + '/api/covieadmin/InsertProperty', Property,{ headers: this.PostToken });
            return propertyID;
    }

    updateProperty(Property: PropertyModel): Observable<any> {        
        var propertyID=  this.http.post(this.baseUrl + '/api/covieadmin/UpdateProperty', Property,{ headers: this.PostToken });
        return propertyID;
    }
    updatePropertyImages(Property: UpdatePropertyImagesModel[]): Observable<any> {        
        var propertyID=  this.http.post(this.baseUrl + '/api/covieadmin/UpdatePropertyImages', Property,{ headers: this.PostToken });
        return propertyID;
    }

    deleteProperty(Propertyid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteProperty?PropertyID=' + Propertyid,{ headers: this.PostToken });
    }

        //PropertyCategory
        GetAllPropertyCategory(): Observable<PropertyCategoryModel[]> {    
  
            console.log('response Data before:::');   
           var data= this.http.get<PropertyCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllPropertyCategory',{ headers: this.PostToken });
           console.log('response Data:::'+JSON.stringify(data));
        return data;
        }
        findPropertyCategory(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
                   
            console.log('response Data before findPropertyCategory:::');   
            // This code imitates server calls
            return this.http.get<PropertyCategoryModel[]>(this.baseUrl + '/api/covieadmin/GetAllPropertyCategory',{ headers: this.PostToken }).pipe(
                mergeMap(res => {
                    let departmentSelectedlist:PropertyCategoryModel[];              
                    //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                    departmentSelectedlist = res;
                    const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    
        createPropertyCategory(PropertyCategory: PropertyCategoryModel): Observable<any> { 
                
                return this.http.post(this.baseUrl + '/api/covieadmin/InsertPropertyCategory', PropertyCategory,{ headers: this.PostToken });
        }
    
        updatePropertyCategory(PropertyCategory: PropertyCategoryModel): Observable<any> {        
                return this.http.post(this.baseUrl + '/api/covieadmin/UpdatePropertyCategory', PropertyCategory,{ headers: this.PostToken });
        }
    
        deletePropertyCategory(PropertyCategoryid: number): Observable<any> {        
                return this.http.get(this.baseUrl + '/api/covieadmin/DeletePropertyCategory?PropertyCategoryID=' + PropertyCategoryid,{ headers: this.PostToken });
        }

            //PropertyType
    GetAllPropertyType(): Observable<PropertyTypeModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<PropertyTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllPropertyType',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findPropertyType(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findPropertyType:::');   
        // This code imitates server calls
        return this.http.get<PropertyTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllPropertyType',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let departmentSelectedlist:PropertyTypeModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                departmentSelectedlist = res;
                const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createPropertyType(PropertyType: PropertyTypeModel): Observable<any> { 
            
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertPropertyType', PropertyType,{ headers: this.PostToken });
    }

    updatePropertyType(PropertyType: PropertyTypeModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdatePropertyType', PropertyType,{ headers: this.PostToken });
    }

    deletePropertyType(PropertyTypeid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeletePropertyType?PropertyTypeID=' + PropertyTypeid,{ headers: this.PostToken });
    }

        //Signup
        GetAllSignup(): Observable<SignupModel[]> {    
  
            console.log('response Data before:::');   
           var data= this.http.get<SignupModel[]>(this.baseUrl + '/api/covieadmin/GetAllSignup',{ headers: this.PostToken });
           console.log('response Data:::'+JSON.stringify(data));
        return data;
        }
        findSignup(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
                   
            console.log('response Data before findSignup:::');   
            // This code imitates server calls
            return this.http.get<SignupModel[]>(this.baseUrl + '/api/covieadmin/GetAllSignup',{ headers: this.PostToken }).pipe(
                mergeMap(res => {
                    let departmentSelectedlist:SignupModel[];              
                    //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                    departmentSelectedlist = res;
                    const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                    return of(result);
                })
            );
        }
    
        createSignup(Signup: SignupModel): Observable<any> { 
                
                return this.http.post(this.baseUrl + '/api/covieadmin/InsertSignup', Signup,{ headers: this.PostToken });
        }
    
        updateSignup(Signup: SignupModel): Observable<any> {        
                return this.http.post(this.baseUrl + '/api/covieadmin/UpdateSignup', Signup,{ headers: this.PostToken });
        }
    
        deleteSignup(Signupid: number): Observable<any> {        
                return this.http.get(this.baseUrl + '/api/covieadmin/DeleteSignup?SignupID=' + Signupid,{ headers: this.PostToken });
        }

            //WingType
    GetAllWingType(): Observable<WingTypeModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<WingTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllUnits_Type',{ headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findWingType(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findWingType:::');   
        // This code imitates server calls
        return this.http.get<WingTypeModel[]>(this.baseUrl + '/api/covieadmin/GetAllUnits_Type',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let departmentSelectedlist:WingTypeModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                departmentSelectedlist = res;
                const result = this.httpUtils.baseFilter(departmentSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }

    createWingType(WingType: WingTypeModel): Observable<any> { 
            
            return this.http.post(this.baseUrl + '/api/covieadmin/InsertUnits_Type', WingType,{ headers: this.PostToken });
    }

    updateWingType(WingType: WingTypeModel): Observable<any> {        
            return this.http.post(this.baseUrl + '/api/covieadmin/UpdateUnits_Type', WingType,{ headers: this.PostToken });
    }

    deleteWingType(WingTypeid: number): Observable<any> {        
            return this.http.get(this.baseUrl + '/api/covieadmin/DeleteUnits_Type?Units_TypeID=' + WingTypeid,{ headers: this.PostToken });
    }

    // Gender
    GetAllGender(): Observable<GenderModel[]> {    
  
        console.log('response Data before:::');   
       var data= this.http.get<GenderModel[]>(this.baseUrl + '/api/covieadmin/GetAllGender',
       { headers: this.PostToken });
       console.log('response Data:::'+JSON.stringify(data));
    return data;
    }
    findGender(queryParams: QueryParamsModel): Observable<QueryResultsModel> { 
               
        console.log('response Data before findPropertyType:::');   
        // This code imitates server calls
        return this.http.get<GenderModel[]>(this.baseUrl + '/api/covieadmin/GetAllGender',{ headers: this.PostToken }).pipe(
            mergeMap(res => {
                let GenderSelectedlist:GenderModel[];              
                //departmentSelectedlist = res.filter(row=>row.companyid.toString() == this.resultFilterByCompany());
                GenderSelectedlist = res;
                const result = this.httpUtils.baseFilter(GenderSelectedlist, queryParams, []);
                return of(result);
            })
        );
    }
}
