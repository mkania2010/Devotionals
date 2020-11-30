import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Devotional } from '../devotional.model';
import { DevotionalService } from '../devotional.service';
// import { count } from 'console';
import { FilterCountService } from '../filter-count.service';



@Component({
	selector: 'app-devo-list',
	templateUrl: './devo-list.component.html',
	styleUrls: ['./devo-list.component.css']
})
export class DevoListComponent implements OnInit, OnDestroy {

	@Output() selectedDevotionalEvent = new EventEmitter<Devotional>();
	devoSubscription: Subscription;
	filterSubscription: Subscription;
	devotionals: Devotional[] = [];
	loadingStatus = true;
	filterCount: number = null;
	infoHeight = 3;
	infoOverflow = 'hidden';


	// Variables for filters
	devoName: string = null;
	devoSpeaker: string = null;
	speakerPosition: string = null;
	devoCampus = 'all';
	includeVideo = false;
	includeAudio = false;
	sortingMethod = 'newest';
	devoYear: number;

	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute, public filterService: FilterCountService) {}
	ngOnInit(): void {
		// Subscribe to the route parameters in order to get the year
		this.route.params.subscribe(
			(params: Params) => {
				this.devoYear = params.year;
				// Gets devotionals from the year specified in route - 0 for all devotionals
				// tslint:disable-next-line: triple-equals
				if (this.devoYear != 0)
					this.devotionalService.getDevotionalsYear(this.devoYear);
				else
					this.devotionalService.getDevotionals();
			}
		);

		// Gets the list of devotionals passed by the service and removes the loading spinner
		this.devoSubscription = this.devotionalService.devotionalListChangedEvent
			.subscribe((devotionalList: Devotional[]) => {
				this.devotionals = devotionalList;
				this.loadingStatus = false;
			}
		);

		// Subscription to get the count of devotionals from the filter
		this.filterSubscription = this.filterService.filterChangedEvent
			.subscribe((inputCount: number) => {
				setTimeout(() => {
					this.filterCount = inputCount;
				}, 0);
			}
		);


	}

	// Clear the session and unsubscribe from devotional List changed event when closing tab
	ngOnDestroy(): void {
		this.devoSubscription.unsubscribe();
		this.clearFilters();
	}

	changeYear(): void {
		// Call the loading spinner again
		this.loadingStatus = true;

		// Finally, route to the year selected
		this.router.navigate(['/', this.devoYear]);
	}

	clearFilters(): void {
		// Assign variables to default
		this.devoName = null;
		this.devoSpeaker = null;
		this.speakerPosition = null;
		this.devoCampus = 'all';
		this.includeVideo = false;
		this.includeAudio = false;
		this.sortingMethod = 'newest';

		console.log('Filters cleared');
	}

	// Called from the help panel, expands the height of the panel
	expandInfo(): void {
		const baseHeight = 3;
		const expandedHeight = 26;

		if (this.infoHeight === baseHeight) {
			this.infoHeight = expandedHeight;
			this.infoOverflow = 'scroll';
		} else {
			this.infoHeight = baseHeight;
			this.infoOverflow = 'hidden';
		}
	}
}