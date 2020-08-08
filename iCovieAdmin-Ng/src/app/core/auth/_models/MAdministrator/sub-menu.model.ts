export class SubMenu {

    main_menu_id: number;
    main_menu_name: string;
    sub_menu_id: number;
    sub_menu_name: string;
    sub_menu_path: string;
    main_menu_path: string;
    clear(): void {
        this.main_menu_id = undefined;
        this.main_menu_name = '';
        this.sub_menu_id = undefined;  
        this.sub_menu_name = '';
        this.main_menu_path =''
        this.sub_menu_path =''
	}
}
