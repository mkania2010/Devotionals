import { Pipe, PipeTransform } from '@angular/core';
import { Devotional } from './devotional.model';
import { FilterCountService } from './filter-count.service';

@Pipe({
	name: 'devotionalFilter'
})
export class DevotionalFilterPipe implements PipeTransform {
	constructor(public filterService: FilterCountService) {}

	transform(
		// Parameters that the filter accepts
		devotionals: Devotional[],
		devoName: string,
		devoSpeaker: string,
		speakerPosition: string,
		devoCampus: string,
		includeVideo: boolean,
		includeAudio: boolean,
		sortingMethod: string) {


		let filteredArray: Devotional[] = devotionals;
		const emptyArray: Devotional[] = [];

		// Check if devoName is set and if it's length is more than 0
		if (devoName && devoName.length > 0) {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.devoName != null &&
						devotional.devoName.toLowerCase().includes(devoName.toLowerCase())
					)
			);
		}

		if (devoSpeaker && devoSpeaker.length > 0) {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.author != null &&
						devotional.author.toLowerCase().includes(devoSpeaker.toLowerCase())
					)
			);
		}

		// Hawaii doesn't have speaker posistions
		if ((speakerPosition && speakerPosition.length > 0) && devoCampus !== 'Hawaii') {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.authorTitle != null &&
						devotional.authorTitle.toLowerCase().includes(speakerPosition.toLowerCase())
					)
			);
		}

		if ( (devoCampus && devoCampus.length > 0) && devoCampus !== 'all') {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) =>
					(
						// Conditions for the devo to be added to the filtered list
						devotional.campus != null &&
						devotional.campus.includes(devoCampus)
					)
			);
		}

		// Hawaii doesn't have mp3 or video URLs so ingore those
		if (includeVideo && devoCampus !== 'Hawaii') {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) => ( devotional.video_URI !== null )
			);
		}

		if (includeAudio && devoCampus !== 'Hawaii') {
			filteredArray = filteredArray.filter(
				(devotional: Devotional) => ( devotional.mP3_URI !== null )
			);
		}


		if (sortingMethod === 'newest')
			// Sort Newest to oldest
			filteredArray.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0 ));
		else
			// Sort Oldest to newest
			filteredArray.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0 ));

		// Return statements

		if (filteredArray.length < 1) {
			console.log('Empty filtered array');
			this.filterService.setCount(0);
			return emptyArray;
		}

		// Log the length of the filtered array for funsies
		console.log('Filtered Array Length: ' + filteredArray.length);
		this.filterService.setCount(filteredArray.length);

		return filteredArray;
	}
}