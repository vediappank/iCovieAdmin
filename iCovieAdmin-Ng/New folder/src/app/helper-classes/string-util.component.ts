import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-string-util',
  template: `
    <p>
      string-util works!
    </p>
  `,
  styles: []
})
export class StringUtilComponent implements OnInit {

  private static days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private static months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

  public static split(valueStr: string, splitLiteral: string): string[] {
    console.log('received: ' + valueStr + ' ::split literal :' + splitLiteral);
    if (typeof valueStr !== 'undefined' && valueStr !== '' && valueStr !== 'undefined') {
      return valueStr.split(splitLiteral);
    }
  }

  public static secondsToTime(valueStr: string): string {
    let timeString = '00:00:00';
    if (typeof valueStr !== 'undefined' && valueStr !== '' && valueStr !== 'undefined') {
      const secNum = parseInt(valueStr, 10); // don't forget the second param
      let hours = Math.floor(secNum / 3600);
      let minutes = Math.floor((secNum - (hours * 3600)) / 60);
      let seconds = secNum - (hours * 3600) - (minutes * 60);
      let hoursStr;
      let minutesStr;
      let secondsStr;
      if (hours < 10) { hoursStr = '0' + hours; } else { hoursStr = hours; }
      if (minutes < 10) { minutesStr = '0' + minutes; } else { minutesStr = minutes; }
      if (seconds < 10) { secondsStr = '0' + seconds; } else { secondsStr = seconds; }
      hours = null; minutes = null; seconds = null;
      timeString = hoursStr + ':' + minutesStr + ':' + secondsStr;
    }
    return timeString;
  }

  public static convertToDollar(valueStr: string): string {
    let res = '$0';
    if (typeof valueStr !== 'undefined' && valueStr ) {
      const value = parseInt(valueStr, 10);
      res = '$' + value.toLocaleString( undefined, { minimumFractionDigits: 0 } );
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static dollar(valueStr: number): string {
    let res = '$0';
    if (typeof valueStr !== 'undefined' && valueStr ) {
      res = '$' + valueStr.toLocaleString( undefined, { minimumFractionDigits: 0 } );
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static formatNumber(valueStr: number): string {
    let res = '0';
    if (typeof valueStr !== 'undefined' && valueStr ) {
      res = valueStr.toLocaleString( undefined, { minimumFractionDigits: 0 } );
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static percentage(valueStr: string): string {
    let res = '0%';
    if (typeof valueStr !== 'undefined' && valueStr !== '' && valueStr !== 'undefined') {
      res = valueStr + '%';
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static getInt(valueStr: string): number {
    let res = 0;
    try {
      if (typeof valueStr !== 'undefined' && valueStr !== '' && valueStr !== 'undefined') {
        res = parseInt(valueStr, 10);
      }
    } catch (e) {
      console.log('Got an error!', e);
      res = 0;
    }
    // console.log('received: '+value+' ::converted to :'+this .valueStr);
    return res;
  }

  public static formatDate(valueStr: string): string {
    let res = valueStr;
    try {
      if (typeof valueStr !== 'undefined' && valueStr ) {
        const dateVal = new Date(valueStr);
        // res = this.days[ dateVal.getDay() ] + ', ' + dateVal.get+ this.months[ dateVal.getDay() ];
        const options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        res = dateVal.toLocaleTimeString('en-us', options);
        res = res.substr(0, res.lastIndexOf(','));
        // console.log('formating Date: ' + res);
      }
    } catch (err) {
      console.error('Error in formating Date: ' + valueStr + ':::Error:' + err)
    }
    // console.log('received: ' + valueStr + ' ::converted to :' + res);
    return res;
  }

  constructor() { }

  ngOnInit() {
  }

}
