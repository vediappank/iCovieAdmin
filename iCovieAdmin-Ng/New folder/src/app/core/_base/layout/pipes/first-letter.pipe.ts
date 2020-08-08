// Angular
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		//alert('recive Value::' + value);
		//alert('response value::' + value.split(' ').map(n => n[0]).join(''));
		//if(value != undefined)
		//alert()
		if(value != undefined)
			return value.split(' ').map(n => n[0]).join('');
		else
			return null;
	}
}
