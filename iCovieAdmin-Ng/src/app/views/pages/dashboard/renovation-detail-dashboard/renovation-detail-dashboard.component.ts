import { Component, ViewChild, ViewChildren, ElementRef, QueryList, ChangeDetectorRef, OnInit, Input, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '../../../../core/auth';
import { Store } from '@ngrx/store';


import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';

import { AppState } from '../../../../core/reducers';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { each } from 'lodash';

@Component({
  selector: 'kt-renovation-detail-dashboard',
  templateUrl: './renovation-detail-dashboard.component.html',
  styleUrls: ['./renovation-detail-dashboard.component.scss'],
  
})
export class RenovationDetailDashboardComponent implements OnInit {
 

  constructor(private store: Store<AppState>, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService,
    private cd: ChangeDetectorRef, private _formBuilder: FormBuilder, public auth: AuthService) { }

    ngOnInit() {
       
      }
      
  
  
 
}
