import { PropertyAminitiesModel } from '../..';
import { PropertyImagesModel } from './propertyimages.model';
import { PropertyNeighbourTypeModel } from './propertyneighbourtype.model';


export class PropertyModel {
    id: number;
    companyid: number;
    locationid: number;
    buildingid: number;
    buildingname: string;
    floorid: number;
    unitsid: number;
    address: string;
    noofbeds: string;
    noofboths: string;
    sqft: string;
    cost: string;
    facilitymangerid: number;
    facilityuserid: number;
    communitymangerid: number;
    communityuserid: number;
    pincode: number;
    description: string;
    coordinates: string;
    pricing: string;
    phoneno1: string;
    phoneno2: string;
    phoneno3: string;
    cid: number;
   // isCore: boolean = false;  
    AminitsTypeList: PropertyAminitiesModel[] = [];
    NeighbourCategoryTypeList: PropertyNeighbourTypeModel[]=[];
    ImagesList: PropertyImagesModel[] = [];

    bedtype: number;
    businesscategory: number;
    guesttype: number;
    propertycategory: number;
    propertytype: number;
    discountpricing : string;
    propertyname: string;
    yearbuild: string;
    propertyvideo: string;
    gender: number;

    clear(): void {
        this.id = undefined;
        
        this.companyid=undefined;
        this.locationid=undefined;
        this.buildingid=undefined;
        this.floorid=undefined;
        this.unitsid=undefined;
        this.address='';
        this.noofbeds='';
        this.noofboths='';
        this.sqft='';
        this.cost=undefined;
        this.facilitymangerid=undefined;
        this.facilityuserid=undefined;
        this.communitymangerid=undefined;
        this.communityuserid=undefined;
        this.pincode=undefined;
        this.description='';
        this.coordinates='';
        this.pricing='';
        this.phoneno1='';
        this.phoneno2='';
        this.phoneno3='';
        this.cid = undefined;
       // this.isCore = false;
        this.bedtype= undefined;
        this.businesscategory= undefined;
        this.guesttype= undefined;
        this.propertycategory= undefined;
        this.propertytype= undefined;
        this.discountpricing = undefined;
        this.propertyname= '';
        this.yearbuild='';
        this.propertyvideo='';
        this.gender= undefined;
    
    this.AminitsTypeList =[];
    }
}

