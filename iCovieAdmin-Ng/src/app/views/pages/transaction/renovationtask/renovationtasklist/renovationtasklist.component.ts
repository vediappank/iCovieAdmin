import { Component, ViewChild, ViewChildren, ElementRef, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '../../../../../core/auth';
import { Store } from '@ngrx/store';
import { QueryParamsModel } from '../../../../../core/_base/crud';

import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { RenovationtaskeditComponent } from '../../renovationtask/renovationtaskedit/renovationtaskedit.component';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { RenovationeditComponent } from '../../renovation/renovationedit/renovationedit.component';
import { AppState } from '../../../../../core/reducers';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { each } from 'lodash';
import { number } from '@amcharts/amcharts4/core';
import * as moment from 'moment';
import { round } from '@amcharts/amcharts4/.internal/core/utils/Math';

@Component({
  selector: 'kt-renovationtasklist',
  templateUrl: './renovationtasklist.component.html',
  styleUrls: ['./renovationtasklist.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RenovationtasklistComponent implements OnInit {
  ngOnInit() {

    
  }

  }
