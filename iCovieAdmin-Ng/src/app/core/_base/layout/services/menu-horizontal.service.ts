// Angular
import { Injectable, OnDestroy } from '@angular/core';
// RxJS
import { BehaviorSubject, Subscription } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuHorizontalService implements OnDestroy {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	private unsubscribe: Subscription[] = [];
	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService) {
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		let menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'header.items');

		const subscr = this.menuConfigService.onConfigUpdated$.subscribe(cfg => {
			menuItems = objectPath.get(cfg, 'header.items');
			console.log( 'MenuHorizontalService:::menuItems::'+ JSON.stringify(menuItems) );
			this.menuList$.next(menuItems);
		});
		this.unsubscribe.push(subscr);
	}
	
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
