import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'devotinoalFilter'
})
export class DevotionalFilterPipe implements PipeTransform {

	transform(value: unknown, ...args: unknown[]): unknown {
		return null;
	}

}
