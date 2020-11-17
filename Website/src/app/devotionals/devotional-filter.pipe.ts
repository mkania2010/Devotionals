import { Pipe, PipeTransform } from '@angular/core';
import { Devotional } from './devotional.model';

@Pipe({
	name: 'devotionalFilter'
})
export class DevotionalFilterPipe implements PipeTransform {

	transform(devotionals: Devotional[], devoName: string, devoSpeaker: string, devoCampus: string) {

		let filteredArray: Devotional[] = devotionals;
		const emptyArray: Devotional[] = [];

		if (devoName && devoName.length > 0) {
			filteredArray = devotionals.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.devoName != null &&
						devotional.devoName.toLowerCase().includes(devoName.toLowerCase())
					)
			);
		}

		if (devoSpeaker && devoSpeaker.length > 0) {
			filteredArray = devotionals.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.author != null &&
						devotional.author.includes(devoSpeaker)
					)
			);
		}

		if (devoCampus && devoCampus.length > 0) {
			filteredArray = devotionals.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.campus != null &&
						devotional.campus.includes(devoCampus)
					)
			);
		}

		if (filteredArray.length < 1) {
			return emptyArray;
		}
		console.log(filteredArray.length);
		return filteredArray;
	}
}