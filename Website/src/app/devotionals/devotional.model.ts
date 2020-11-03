import { Injectable } from '@angular/core';
import { Url } from 'url';

@Injectable()

export class Devotional {
	constructor(
		public id: string,
		public DevoName: string,
		public Author: string,
		public AuthorTitle: string,
		public Date: Date,
		public Campus: string,
		public URI: Url,
		public MP3_URI: Url,
		// tslint:disable-next-line: variable-name
		public Video_URI: Url
	) {}
}