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

	// Variables for filter
	devoName: string = null;
	devoSpeaker: string = null;
	devoCampus: string = null;
	includeVideo = false;
	includeAudio = false;


	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.loadSessionVariables();

		this.route.params.subscribe(
			(params: Params) => {
				// Gets devotionals from the year specified in route
				// tslint:disable-next-line: triple-equals
				if (params.year != 0)
					this.devotionalService.getDevotionalsYear(params.year);
				else
					this.devotionalService.getDevotionals();
			}
		);

		this.subscription = this.devotionalService.devotionalListChangedEvent
			.subscribe((devotionalList: Devotional[]) => {
				this.devotionals = devotionalList;
				this.loadingStatus = false;
			}
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		sessionStorage.clear();
	}

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
	}

	changeYear(devoYear: number): void {
		if (this.devoName)
			sessionStorage.setItem('devoName', this.devoName);
		if (this.devoSpeaker)
			sessionStorage.setItem('devoSpeaker', this.devoSpeaker);
		if (this.devoCampus)
			sessionStorage.setItem('devoCampus', this.devoCampus);
		if (this.includeAudio)
			sessionStorage.setItem('includeAudio', 'true');
		if (this.includeVideo)
			sessionStorage.setItem('includeVideo', 'true');

		this.router.navigate(['/', devoYear]);
	}

	clearFilters(): void {
		sessionStorage.clear();
	}
}