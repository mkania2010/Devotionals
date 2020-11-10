import { Component, Input, OnInit } from '@angular/core';
import { Devotional } from '../../devotional.model';


@Component({
	selector: 'app-devo-item',
	templateUrl: './devo-item.component.html',
	styleUrls: ['./devo-item.component.css']
})
export class DevoItemComponent implements OnInit {
	@Input() devotional: Devotional;

	constructor() { }

	ngOnInit(): void { }

}
