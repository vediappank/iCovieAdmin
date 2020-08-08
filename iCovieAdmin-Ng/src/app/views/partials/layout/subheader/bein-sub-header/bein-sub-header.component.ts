// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';
import { BRDashboardService } from '../../../../../views/pages/dashboard/_services/brdashboard.service';

@Component({
  selector: 'kt-bein-sub-header',
  templateUrl: './bein-sub-header.component.html',
  styleUrls: ['./bein-sub-header.component.scss']
})
export class BeinSubHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  // Public properties
  @Input() fluid: boolean;
  @Input() clear: boolean;

  today: number = Date.now();
  title: string;
  desc: string;
  breadcrumbs: Breadcrumb[] = [];
  stDT: string;
  endDT: string;

  // Private properties
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param subheaderService: SubheaderService
   */
  constructor(public subheaderService: SubheaderService, private brdService: BRDashboardService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
      // breadcrumbs title sometimes can be undefined
      if (bt) {
        Promise.resolve(null).then(() => {
          this.title = bt.title;
          this.desc = bt.desc;
        });
      }
    }));

    this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
      Promise.resolve(null).then(() => {
        this.breadcrumbs = bc;
      });
    }));

    this.subscriptions.push(this.brdService.brdStDT$.subscribe(stDT => {
      Promise.resolve(null).then(() => {
        this.stDT = stDT;
      });
    }));

    this.subscriptions.push(this.brdService.brdEndDT$.subscribe(endDT => {
      Promise.resolve(null).then(() => {
        this.endDT = endDT;
      });
    }));
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
