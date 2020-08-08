import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'kt-variable-radius-pie-widget',
  templateUrl: './variable-radius-pie-widget.component.html',
  styleUrls: ['./variable-radius-pie-widget.component.scss']
})
export class VariableRadiusPieWidgetComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() public title: string;
  @Input() public desc: string;
  @Input() public chValueField = 'value';
  @Input() public chRadiusValueField = 'value';
  @Input() public chCategoryField = 'id';
  @Input() public chData: any[];
  @Input() public chartHeight = '120px';

  @Output() parentComp: EventEmitter<string> = new EventEmitter<string>();

  public vrPieChart: am4charts.PieChart;
  public vrPieChartSeries: any;

  constructor(private zone: NgZone) { }

  ngOnInit() {
    /* Chart code */
    am4core.options.commercialLicense = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
  }

  ngAfterViewInit() {
    /*this.zone.runOutsideAngular(() => {
      // Create chart
      const amChartInst = am4core.create('chartDiv', am4charts.PieChart);
      amChartInst.hiddenState.properties.opacity = 0; // this creates initial fade-in
      amChartInst.data = [{
        AuxCode: 'Lithuania',
        AuxPer: 501.9
      }, {
        AuxCode: 'Czech Republic',
        AuxPer: 301.9
      }];

      const series = amChartInst.series.push(new am4charts.PieSeries());
      series.dataFields.value = 'AuxCode';
      series.dataFields.radiusValue = 'AuxCode';
      series.dataFields.category = 'AuxPer';
      series.slices.template.cornerRadius = 6;
      series.colors.step = 3;

      series.hiddenState.properties.endAngle = -90;

      // This creates initial animation
      series.hiddenState.properties.opacity = 1;
      series.hiddenState.properties.endAngle = -90;
      series.hiddenState.properties.startAngle = -90;

      amChartInst.legend = new am4charts.Legend();

      this.vrPieChart = amChartInst;
      this.vrPieChartSeries = series;
    });*/
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.vrPieChart) {
        this.vrPieChart.dispose();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'chData') {
        const change = changes[propName];
        if (change.currentValue) {
          console.log('AMChart Variable Radius Pie Chart Widget - Data Changes::::' + JSON.stringify(change.currentValue));
          // this.vrPieChart.data = change.currentValue;

          if ( this.vrPieChart ) {
            this.vrPieChart.dispose();
          }

          const amChartInst = am4core.create('chartDiv', am4charts.PieChart);
          amChartInst.hiddenState.properties.opacity = 0; // this creates initial fade-in
          amChartInst.data = change.currentValue;

          const series = amChartInst.series.push(new am4charts.PieSeries());
          series.dataFields.value = 'AuxCode';
          series.dataFields.radiusValue = 'AuxCode';
          series.dataFields.category = 'AuxPer';
          series.slices.template.cornerRadius = 6;
          series.colors.step = 3;

          series.hiddenState.properties.endAngle = -90;

          // This creates initial animation
          series.hiddenState.properties.opacity = 1;
          series.hiddenState.properties.endAngle = -90;
          series.hiddenState.properties.startAngle = -90;

          amChartInst.legend = new am4charts.Legend();

          this.vrPieChart = amChartInst;
          this.vrPieChartSeries = series;
        }
      } else if (propName === 'chValueField' && this.vrPieChartSeries ) {
        this.vrPieChartSeries.dataFields.value = this.chValueField;
      } else if (propName === 'chRadiusValueField' && this.vrPieChartSeries ) {
        this.vrPieChartSeries.dataFields.radiusValue = this.chRadiusValueField;
      } else if (propName === 'chCategoryField' && this.vrPieChartSeries ) {
        this.vrPieChartSeries.dataFields.category = this.chCategoryField;
      }
    }
  }

}
/* Imports */



