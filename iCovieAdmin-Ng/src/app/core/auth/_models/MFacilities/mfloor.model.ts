import { BaseModel } from '../../../_base/crud';
import { PropertyFloorCheckBoxesModel } from '../Masters/propertyfloorcheckboxes.model';

export class MFloorModel extends BaseModel {
    id: number;
    companyname: string;
    locationname: string;
    buildingname: string;
    floorname: string;
    shortname: string;
    cid: number;
    companyid: number;
    companyids: number[];
    locationid: number;
    locationids: number[];
    buildingid: number;
    buildingids: number[];
    isactive: boolean;
    isCore: boolean = false;
    floorcheckedlist: PropertyFloorCheckBoxesModel[]=[];
    clear(): void {
        this.id = undefined;
        this.companyname = '';
        this.locationname = '';
        this.buildingname = '';
        this.floorname = '';
        this.shortname = '';
        this.cid = undefined;
        this.companyid = undefined;
        this.isactive = true;
        this.isCore = false;
        this.companyids = undefined;
        this.locationids = undefined;
        this.locationids = undefined;
        this.buildingid = undefined;
        this.buildingids = undefined;
    }
}

