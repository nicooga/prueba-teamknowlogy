import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * @export
 * @class SecondaryMenuComponent
 */
@Component({
	selector: 'sq-secondary-menu',
	templateUrl: './secondary-menu.component.html',
	styleUrls: ['./secondary-menu.component.scss']
})
export class SecondaryMenuComponent {

	public iconFullScreen = 'icon-expand';

	// Inputs
	@Input() type = 'payment';
	@Input() section = 'pulse';
	@Input() channel = 'facebook';
	@Input() showOptions = true;
	@Input() customeTabs = false;
	// Output
	@Output() menuOnEdit = new EventEmitter();
	@Output() menuOnDownload = new EventEmitter();
	@Output() menuOnChangePermissions = new EventEmitter();
	// constructor
	public constructor() {
	}
	// Toggle full screen
	toggleFullscreen() {
		const elem = document.documentElement;
		if (!document['fullscreenElement']) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
				this.iconFullScreen = 'icon-minimize-2';
			}
		} else {
			if (document['exitFullscreen']) {
				document['exitFullscreen']();
				this.iconFullScreen = 'icon-expand';

			}
		}
	}
	goToSection($event) {
		alert('asd');
		$event.preventDefault();
		$event.stopPropagation();
	}
	edit() {
		this.menuOnEdit.emit();
	}
	download() {
		this.menuOnDownload.emit();
	}
	changePermissions() {
		this.menuOnChangePermissions.emit();
	}
}
