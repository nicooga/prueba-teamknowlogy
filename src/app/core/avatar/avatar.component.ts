import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'sq-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

	@Input() user;
	@Input() clazz = '';

	constructor() { }

	ngOnInit() {
	}

}
