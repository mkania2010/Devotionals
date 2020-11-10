import { Injectable } from '@angular/core';
import { Url } from 'url';

@Injectable()

export class Devotional {
	constructor(
		public id: string,
		public devoName: string,
		public author: string,
		public authorTitle: string,
		public date: Date,
		public campus: string,
		public uri: Url,
		// tslint:disable-next-line: variable-name
		public mP3_URI: Url,
		// tslint:disable-next-line: variable-name
		public video_URI: Url
	) {}
}