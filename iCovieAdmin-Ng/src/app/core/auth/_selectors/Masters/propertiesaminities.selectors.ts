export class PropertyAminitiesModel {
    id: number;
    propertyid: number;
    amnitiesid: number;
    cid: number;
    isCoreCategory: boolean = false;
    clear(): void {
        this.id = undefined;
        
        this.propertyid=undefined;
        this.amnitiesid=undefined;
        
        this.cid = undefined;
        this.isCoreCategory = false;
    }
}

