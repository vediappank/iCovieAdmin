import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { LayoutConfigService } from '../../../../core/_base/layout';

@Injectable({
  providedIn: 'root'
})
export class BRDashboardService implements OnInit {

  private brdStDT = new BehaviorSubject<string>(null);
  public brdStDT$ = this .brdStDT.asObservable();
  private brdEndDT = new BehaviorSubject<string>(null);
  public brdEndDT$ = this .brdEndDT.asObservable();

  constructor(private layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
    this.setBrdStDT( moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD') );
    this.setBrdEndDT( moment().subtract(0, 'years').endOf('year').format('YYYY-MM-DD') );
  }

  public setBrdStDT(stDT: string): void {
    if ( stDT ) {
      this.brdStDT.next( stDT );
    }
  }

  public setBrdEndDT(endDT: string): void {
    if ( endDT ) {
      this.brdEndDT.next( endDT );
    }
  }

  public setDashboardSubHeader(): void {
    const defSubHeader = {
      demo: 'beINInsight',
      subheader: {
        layout: 'beIN-SubHeader-v1',
      }
    };
    this.layoutConfigService.setConfig(defSubHeader, true);
  }

  public resetDashboardSubHeader(): void {
    const defSubHeader = {
      demo: 'beINInsight',
      subheader: {
        layout: 'subheader-v2',
      }
    };
    this.layoutConfigService.setConfig(defSubHeader, true);
  }
}
