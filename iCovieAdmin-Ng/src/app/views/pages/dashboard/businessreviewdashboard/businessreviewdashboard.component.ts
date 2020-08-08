import { Component, OnInit, Inject, ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';


import { CCAbsentiesRequest } from '../_models/ccabsentiesrequest.model';


import { AuthService } from '../../../../core/auth';

import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';


import { DOCUMENT } from '@angular/common';
import { keys } from '@amcharts/amcharts4/.internal/core/utils/Object';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';


import { LayoutUtilsService } from '../../../../core/_base/crud';
import { MatDialog, MatRadioButton } from '@angular/material';


import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import * as $ from 'jquery';



@Component({
  selector: 'kt-businessreviewdashboard',
  templateUrl: './businessreviewdashboard.component.html',
  styleUrls: ['./businessreviewdashboard.component.scss']
})
export class BusinessreviewdashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}