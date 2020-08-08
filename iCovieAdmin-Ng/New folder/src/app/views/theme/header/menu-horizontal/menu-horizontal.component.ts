// Angular
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {
  LayoutConfigService,
  MenuConfigService,
  MenuHorizontalService,
  MenuOptions,
  OffcanvasOptions
} from '../../../../core/_base/layout';
// HTML Class
import { HtmlClassService } from '../../html-class.service';

@Component({
  selector: 'kt-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit, AfterContentInit {
  // Public properties
  currentRouteUrl: any = '';

  rootArrowEnabled: boolean;

  

  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    }
  };

  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'kt-header-menu-wrapper',
    closeBy: 'kt_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'kt_header_mobile_toggler',
      state: 'kt-header-mobile__toolbar-toggler--active'
    }
  };

  @ViewChild('menuBarHor', { static: false }) menuBarHorView;

  /**
   * Component Conctructor
   *
   * @param el: ElementRef
   * @param htmlClassService: HtmlClassService
   * @param menuHorService: MenuHorService
   * @param menuConfigService: MenuConfigService
   * @param layoutConfigService: LayouConfigService
   * @param router: Router
   * @param render: Renderer2
   * @param cdr: ChangeDetectorRef
   */
  constructor(
    private el: ElementRef,
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private menuConfigService: MenuConfigService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
  }

  // for transcluded content
  ngAfterContentInit() {
  }

  /**
   * On init
   */
  ngOnInit(): void {
  
    this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.root-arrow');

    this.currentRouteUrl = this.router.url;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url;
        this.cdr.markForCheck();
      });
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseEnter(e: Event) {
    // check if the left aside menu is fixed
    // console.log('Link Mouse Enter Target: ' + JSON.stringify(e.target));
    if (!document.body.classList.contains('kt-menu__item--hover')) {
      this.render.addClass(document.body, 'kt-menu__item--hover');
    }
  }

  /**
   * Mouse Leave event
   * @param event: MouseEvent
   */
  mouseLeave(event: MouseEvent) {
    // console.log('Link Mouse Leave left Target: ' + JSON.stringify(event.target));
    this.render.removeClass(event.target, 'kt-menu__item--hover');
  }

  /**
   * Mouse Leave event
   * @param event: MouseEvent
   */
  menuItemSelected(event) {
    // event.stopPropagation();
    this.render.removeClass( event.target, 'kt-menu__item--hover');
    // console.log('Link Selected Target: ' + JSON.stringify(event.target));
    // console.log('Link Selected Target:1 ' + JSON.stringify(event.target.parentNode) +
    //  ':::type: ' + JSON.stringify(event.target.parentNode.type ));
    // console.log('Link Selected Target:2 ' + JSON.stringify(event.target.parentNode.parentNode) +
    //  ':::LI Element::' + JSON.stringify(typeof event.target.parentNode.parentNode) );
    // console.log('Link Selected Target:3 ' + JSON.stringify(event.target.parentNode.parentNode.parentNode.parentNode.parentNode));
    // console.log('Link Selected Target:4 ' + JSON.stringify(event.target.parentNode.parentNode.parentNode
    // .parentNode.parentNode.parentNode));
    // if ( event.target.parentNode ) {
    // const custEvent = new MouseEvent('click');
    // this.menuBarHorView.dispatchEvent( custEvent );

    const liEles = this.menuBarHorView.nativeElement.getElementsByTagName('li');
    // console.log('LI Elements in ngAfterViewInit: ' +  JSON.stringify( liEles ) );
    if ( liEles ) {
      for (let i = 0 ; i < liEles.length; i++ ) {
        this.render.removeClass( liEles[i], 'kt-menu__item--hover');
      }
      // divE.map(ele => this.render.removeClass( ele, 'kt-menu__item--hover') );
      // this.render.removeClass( divE, 'kt-menu__item--hover');
    }

    // }
    // this.render.removeClass( document.body, 'kt-menu__item--hover');
    // this.render.removeClass( event.target.parentNode.parentNode, 'kt-menu__item--hover');
    // this.render.removeClass( event.target.parentNode.parentNode.parentNode.parentNode, 'kt-menu__item--hover');
    // event.preventDefault();
    //
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'kt-menu__item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' kt-menu__item--submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' kt-menu__item--active kt-menu__item--here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' kt-menu__item--open kt-menu__item--here';
    }

    if (objectPath.get(item, 'resizer')) {
      classes += ' kt-menu__item--resize';
    }

    const menuType = objectPath.get(item, 'submenu.type') || 'classic';
    if ((objectPath.get(item, 'root') && menuType === 'classic')
      || parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
      classes += ' kt-menu__item--rel';
    }

    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' kt-menu__item--icon-only';
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = '';

    const alignment = objectPath.get(item, 'alignment') || 'right';

    if (alignment) {
      classes += ' kt-menu__submenu--' + alignment;
    }

    const type = objectPath.get(item, 'type') || 'classic';
    if (type === 'classic') {
      classes += ' kt-menu__submenu--classic';
    }
    if (type === 'tabs') {
      classes += ' kt-menu__submenu--tabs';
    }
    if (type === 'mega') {
      if (objectPath.get(item, 'width')) {
        classes += ' kt-menu__submenu--fixed';
      }
    }

    if (objectPath.get(item, 'pull')) {
      classes += ' kt-menu__submenu--pull';
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }
}
