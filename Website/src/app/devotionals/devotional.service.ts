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

	sortAndSend() {
		this.devotionals.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0 ));
		this.devotionalListChangedEvent.next(this.devotionals.slice());
	}

	getDevotionals() {
		return this.http.get<{ message: string, devotionals: Devotional[] }>
		// ('https://localhost:5001/api/devotionals').subscribe(
			('https://api.devotionals.xyz/').subscribe(
				(devotionalData) => {
					this.devotionals = JSON.parse(JSON.stringify(devotionalData));
					this.sortAndSend();
				},
				(error: any) => {
					console.log('Full List error: ' + error);
				}
			);
	}

	getDevotionalsYear(devoYear: number) {
		// Check that input was a number at least
		const inputYear: number = +devoYear;
		if ( isNaN(inputYear) ) {
			console.log('Invalid year request: ' + devoYear);
			this.router.navigate(['/']);
			return;
		}

		return this.http.get<{ message: string, devotionals: Devotional[] }>
			(`https://api.devotionals.xyz/${inputYear}`).subscribe(
				(devotionalData) => {
					this.devotionals = JSON.parse(JSON.stringify(devotionalData));

					this.sortAndSend();
				},
				(error: any) => {
					console.log('No results for year: ' + devoYear);

					// Send the user back to the current year since the request failed
					this.router.navigate(['/']);
				}
			);
	}

	getDevotional(devotionalID: string): Devotional {
		for (const devotional of this.devotionals) {
			if (devotional.id === devotionalID) {
				return devotional;
			}
		}
		return null;
	}
}