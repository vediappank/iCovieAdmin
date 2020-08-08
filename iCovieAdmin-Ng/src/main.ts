import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { LicenseManager } from 'ag-grid-enterprise';
// LicenseManager.setLicenseKey(
//   'Bein_Media_Group_Bein_Media_Group_single_1_Devs__11_September_2020_[v2]_MTU5OTc4MjQwMDAwMA==81b2092e3c967a0a47c97abecc7d1c89');

if (environment.production) {
  enableProdMode();
}

Chart.plugins.unregister(ChartDataLabels);
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error('Bootstrap Loading Error: ' + err));
