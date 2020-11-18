import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Devotional } from '../devotional.model';
import { DevotionalService } from '../devotional.service';

@Component({
	selector: 'app-devo-detail',
	templateUrl: './devo-detail.component.html',
	styleUrls: ['./devo-detail.component.css']
})
export class DevoDetailComponent implements OnInit {
	devotional: Devotional;
	subscription: Subscription;
	id: string = null;

	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit(): void {
		// Subscribe to the parameters to get the devotional ID, and call the devo service to get the details
		this.route.params.subscribe(
			(params: Params) => {
				this.devotional = this.devotionalService.getDevotional(params.id);
			}
		);

		// Updates the devotional in the detail component once the devo list loads
		// Only subscribe if the id is present in the route params
		if (this.id != null ) {
			this.subscription = this.devotionalService.devotionalListChangedEvent
				.subscribe((devotionalList: Devotional[]) => {
					this.devotional = this.devotionalService.getDevotional(this.id);
				}
			);
		}
	}
}
