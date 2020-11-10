import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Devotional } from './devotional.model';
import { stringify } from 'querystring';

@Injectable({
	providedIn: 'root'
})
export class DevotionalService {
	devotionals: Devotional[] = [];
	devotionalListChangedEvent = new Subject<Devotional[]>();

	constructor(private http: HttpClient) {}

	sortAndSend() {
		this.devotionals.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0 ));
		this.devotionalListChangedEvent.next(this.devotionals.slice());
	}

	getDevotionals() {
		return this.http.get<{ message: string, devotionals: Devotional[] }>
		// ('https://localhost:5001/api/devotionals').subscribe(
			('https://api.thatsite.pw/').subscribe(
				(devotionalData) => {
					this.devotionals = JSON.parse(JSON.stringify(devotionalData));
					this.sortAndSend();
				},
				(error: any) => {
					console.log(error);
				}
			);
	}

	getDevotionalsYear(devoYear: number) {
		return this.http.get<{ message: string, devotionals: Devotional[] }>
			(`https://api.thatsite.pw/${devoYear}`).subscribe(
				(devotionalData) => {
					this.devotionals = JSON.parse(JSON.stringify(devotionalData));
					this.sortAndSend();
				},
				(error: any) => {
					console.log(error);
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