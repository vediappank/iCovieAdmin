// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kt-subheader',
  templateUrl: './subheader.component.html',
})
export class SubheaderComponent implements OnInit, OnDestroy {
  // Public properties
  // subheader layout
  layout: string;
  fluid: boolean;
  clear: boolean;

  // Private properties
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   */
  constructor(private layoutConfigService: LayoutConfigService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.updateLayoutConfig();
    const subscr = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
      setTimeout(() => {
        this.updateLayoutConfig();
      });
    });
    this.unsubscribe.push(subscr);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }

  updateLayoutConfig(): void {
    console.log('Sub Header Component: Layout:: ' + this.layout);
    this.layout = this.layoutConfigService.getConfig('subheader.layout');
    this.fluid = this.layoutConfigService.getConfig('subheader.width') === 'fluid';
    this.clear = this.layoutConfigService.getConfig('subheader.clear');
  }
}
