// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
// RxJS
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';




// State
import { AppState } from '../../../../../core/reducers';

// Services and Models

import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { debug } from 'webpack';



@Component({
	selector: 'kt-Renovationedit',
	templateUrl: './Renovationedit.component.html',
	styleUrls: ['./Renovationedit.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class RenovationeditComponent implements OnInit {
		constructor(public dialogRef: MatDialogRef<RenovationeditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getCompanyLocation = this.auth.getItems();
		
	}

	/**
	 * On init
	 */
	ngOnInit() {
	
	}

	
}
