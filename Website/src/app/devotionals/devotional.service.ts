import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Devotional } from './devotional.model';

@Injectable({
	providedIn: 'root'
})
export class DevotionalService {
	devotionals: Devotional[] = [];
	devotionalListChangedEvent = new Subject<Devotional[]>();

	constructor(private http: HttpClient, private router: Router) {}

	// Function used to sort the list, but that was moved to the filter, it just pushes the list to an event
	sortAndSend() {
		// this.devotionals.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0 ));
		this.devotionalListChangedEvent.next(this.devotionals.slice());
	}

	// Get the full list of devotionals - these are called from devo-list.ts
	getDevotionals() {
		return this.http.get<{ message: string, devotionals: Devotional[] }>
		// ('https://localhost:5001/api/devotionals').subscribe(
			('https://api.devotionals.xyz/').subscribe(
				(recievedDevotionalData) => {
					// Parse the JSON before sending it to be pushed
					this.devotionals = JSON.parse(JSON.stringify(recievedDevotionalData));
					this.sortAndSend();
				},
				(error: any) => {
					// Log any error that may occur, should never occur
					console.log('Full List error: ' + error);
				}
			);
	}

	// Gets devotionals from a specific year
	getDevotionalsYear(devoYear: number) {
		// Verify that the input was a number at least - if it wasn't, log an error and send to default route
		const inputYear: number = +devoYear;
		if ( isNaN(inputYear) ) {
			console.log('Invalid year request: ' + devoYear);
			this.router.navigate(['/']);
			return;
		}

		// Actually call the API and get the list
		return this.http.get<{ message: string, devotionals: Devotional[] }>
			(`https://api.devotionals.xyz/${inputYear}`).subscribe(
				(recievedDevotionalData) => {
					this.devotionals = JSON.parse(JSON.stringify(recievedDevotionalData));

					this.sortAndSend();
				},
				// If there were any errors, it's because there were no devotionals for that year
				(error: any) => {
					console.log('No results for year: ' + devoYear);

					// Send the user back to the default route since the request failed
					this.router.navigate(['/']);
				}
			);
	}


	// Get data on a specific devotional from the list and return it.
	getDevotional(devotionalID: string): Devotional {
		for (const devotional of this.devotionals) {
			if (devotional.id === devotionalID) {
				return devotional;
			}
		}
		return null;
	}
}