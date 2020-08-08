// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
// RxJS
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { QueryParamsModel } from '../../../../../core/_base/crud';



// State
import { AppState } from '../../../../../core/reducers';

// Services and Models

import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-Renovationtaskedit',
  templateUrl: './Renovationtaskedit.component.html',
  styleUrls: ['./Renovationtaskedit.component.scss']
})
export class RenovationtaskeditComponent implements OnInit {
 
  ngOnInit() {

    
    }

    }
