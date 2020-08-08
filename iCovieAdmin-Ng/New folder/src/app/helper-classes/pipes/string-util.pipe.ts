import { Pipe, PipeTransform } from '@angular/core';
import { StringUtilComponent } from '../string-util.component';

@Pipe({
  name: 'stringUtil'
})
export class StringUtilPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    // console.log('Received - value:'+value+':::Arg0'+args[0]+'::::Arg1:'+args[1]);
    let res: any;
    switch(args[0]){
      case 'split': res = StringUtilComponent.split(value, args[1]); break;
      case 'dollar': res = StringUtilComponent.dollar(value); break;
      case 'percentage': res = StringUtilComponent.percentage(value); break;
      case 'secondsToTime': res = StringUtilComponent.secondsToTime(value); break;
    }
    return res;
    /*if( typeof value!=='undefined' && value!=='' && value!=='undefined'){
      return value.split(args[0]);
    }*/
  }

}
