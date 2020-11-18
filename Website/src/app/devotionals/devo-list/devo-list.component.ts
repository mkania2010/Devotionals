import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
	loadingStatus = true;

	// Variables for filters
	devoName: string = null;
	devoSpeaker: string = null;
	devoCampus = 'all';
	includeVideo = false;
	includeAudio = false;
	sortingMethod = 'newest';
	devoYear: number;


	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.loadSessionVariables();

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
		this.subscription = this.devotionalService.devotionalListChangedEvent
			.subscribe((devotionalList: Devotional[]) => {
				this.devotionals = devotionalList;
				this.loadingStatus = false;
			}
		);
	}

	// Clear the session and unsubscribe from devotional List changed event when closing tab
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		sessionStorage.clear();
	}

	// Check if session variables are set and assign the values if they are
	loadSessionVariables() {
		const sessionAudio = sessionStorage.getItem('includeAudio');
		if (sessionAudio)
			(sessionAudio === 'true') ? this.includeAudio = true : this.includeAudio = false;

		const sessionVideo = sessionStorage.getItem('includeVideo');
		if (sessionVideo)
			(sessionVideo === 'true') ? this.includeVideo = true : this.includeVideo = false;

		const sessionName = sessionStorage.getItem('devoName');
		if (sessionName)
			this.devoName = sessionName;

		const sessionSpeaker = sessionStorage.getItem('devoSpeaker');
		if (sessionSpeaker)
			this.devoSpeaker = sessionSpeaker;

		const sessionCampus = sessionStorage.getItem('devoCampus');
		if (sessionCampus)
			this.devoCampus = sessionCampus;

		const sessionSort = sessionStorage.getItem('sortingMethod');
		if (sessionSort)
			this.sortingMethod = sessionSort;
	}

	changeYear(): void {
		// If any filters are not the defaults, set them in session storage
		if (this.devoName)
			sessionStorage.setItem('devoName', this.devoName);
		if (this.devoSpeaker)
			sessionStorage.setItem('devoSpeaker', this.devoSpeaker);
		if (this.devoCampus !== 'all')
			sessionStorage.setItem('devoCampus', this.devoCampus);
		if (this.includeAudio)
			sessionStorage.setItem('includeAudio', 'true');
		if (this.includeVideo)
			sessionStorage.setItem('includeVideo', 'true');
		if (this.sortingMethod === 'oldest')
			sessionStorage.setItem('sortingMethod', 'oldest');

		// Call the loading spinner again
		this.loadingStatus = true;

		// Finally, route to the year selected
		this.router.navigate(['/', this.devoYear]);
	}

	clearFilters(): void {
		// To reset the filters, clear session storage and set variables to default
		sessionStorage.clear();
		this.devoName = null;
		this.devoSpeaker = null;
		this.devoCampus = 'all';
		this.includeVideo = false;
		this.includeAudio = false;
		this.sortingMethod = 'newest';
	}
}