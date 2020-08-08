export class PropertyImagesModel {
    id: number;
    propertyid: number;
    imagename: string;
    imagepath: string;
    cid: number;
    isCoreCategory: boolean = false;
    clear(): void {
        this.id = undefined;
        
        this.propertyid=undefined;
        this.imagename='';
        this.imagepath='';
        
        this.cid = undefined;
        this.isCoreCategory = false;
    }
}

