import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FilterCountService {

	filterCount: number = null;
	filterChangedEvent = new Subject<number>();
	constructor() { }

	setCount(input: number) {
		// this.filterCount = input;
		this.filterChangedEvent.next(input);
	}
}