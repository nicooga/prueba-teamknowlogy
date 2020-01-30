import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'sq-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	@Input() public = true;
	@Input() private = false;
	@Input() basic = false;

	constructor() { }

	ngOnInit() {
	}

}
