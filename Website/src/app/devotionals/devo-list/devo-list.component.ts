import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { Devotional } from '../devotional.model';
import { DevotionalService } from '../devotional.service';

@Component({
	selector: 'app-devo-list',
	templateUrl: './devo-list.component.html',
	styleUrls: ['./devo-list.component.css']
})
export class DevoListComponent implements OnInit, OnDestroy {

	@Output() selectedDevotionalEvent = new EventEmitter<Devotional>();
	subscription: Subscription;
	devotionals: Devotional[] = [];

	constructor(private devotionalService: DevotionalService) {}

	ngOnInit(): void {
		console.log((new Date()).getFullYear());
		this.devotionalService.getDevotionalsYear((new Date()).getFullYear());

		this.subscription = this.devotionalService.devotionalListChangedEvent
			.subscribe((devotionalList: Devotional[]) => {
				this.devotionals = devotionalList;
			});
	}

	ngOnDestroy(): void { this.subscription.unsubscribe(); }
}