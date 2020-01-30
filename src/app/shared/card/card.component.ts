import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'sq-card-shared',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardSharedComponent implements OnInit {

	constructor() { }

	@Input() showTooltip = true;
	@Input() textTooltip = 'textTooltip';
	@Input() title = 'Text card';
	@Input() extraClasses = '';
	@Input() secondaryTitle = false;
	@Input() timeFilter = '';
	@Input() customRightTitle = false;
	@Input() showTitle = true;

	ngOnInit() {
	}

}
