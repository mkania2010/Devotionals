import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe(
			(params: Params) => {
				// Gets devotionals from the year specified in route
				// tslint:disable-next-line: triple-equals
				if (params.year != 1892 && params.year <= 1946)
					this.router.navigate(['/']);
				// tslint:disable-next-line: triple-equals
				else if (params.year != 0)
					this.devotionalService.getDevotionalsYear(params.year);
				else
					this.devotionalService.getDevotionals();
			}
		);

		this.subscription = this.devotionalService.devotionalListChangedEvent
			.subscribe((devotionalList: Devotional[]) => {
				this.devotionals = devotionalList;
			});
	}

	ngOnDestroy(): void { this.subscription.unsubscribe(); }
}