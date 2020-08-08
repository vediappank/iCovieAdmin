// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';






@Component({
  selector: 'kt-consolidate-pages',
  templateUrl: './consolidate-pages.component.html',
  styleUrls: ['./consolidate-pages.component.scss']
})

export class ConsolidatePagesComponent implements OnInit {	
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,		
		private layoutConfigService: LayoutConfigService) {
	}

	ngOnInit() {		
	
	}

	getComponentTitle() {
		let result = 'Facilities Settings';	
		return result;
	}
}

