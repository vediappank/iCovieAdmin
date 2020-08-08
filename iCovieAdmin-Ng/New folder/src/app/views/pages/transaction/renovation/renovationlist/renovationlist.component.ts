// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models

import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { RenovationeditComponent } from '../renovationedit/renovationedit.component';
import { RenovationtaskeditComponent } from '../../renovationtask/renovationtaskedit/renovationtaskedit.component';
import { AuthService } from '../../../../../core/auth';
import * as moment from 'moment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'kt-Renovationlist',
  templateUrl: './Renovationlist.component.html',
  styleUrls: ['./Renovationlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenovationlistComponent implements OnInit {


 
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
   
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
   
  }

}
