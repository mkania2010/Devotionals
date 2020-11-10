import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Devotional } from '../devotional.model';
import { DevotionalService } from '../devotional.service';

@Component({
	selector: 'app-devo-detail',
	templateUrl: './devo-detail.component.html',
	styleUrls: ['./devo-detail.component.css']
})
export class DevoDetailComponent implements OnInit {
	id: string;
	devotional: Devotional;

	constructor(private devotionalService: DevotionalService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit(): void {
		// console.log('First ' + this.id);
		this.route.params.subscribe(
			(params: Params) => {
				this.id = params.id;
				this.devotional = this.devotionalService.getDevotional(this.id);
				// console.log(this.devotional);
			}
		);
		// console.log(this.id);
	}
}
