import { Component } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * Componente principal de la aplicación
 * @export
 * @class AppComponent
 */
@Component({
	selector: 'sq-app',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor(config: NgbRatingConfig) {
		// customize default values of ratings used by this component tree
		config.max = 5;
		this.loadTheme();
	}

	private loadTheme() {
		const configuration = {
		principalColor: '#3B3B3B',
		secondaryColor: '#F8CB1C',
		buttonsColor: '#7070B1',
		hoverColor: '',
		backgroundColor: '#EBEBEB',
		themeActive: 1,
		darkLogo: './assets/images/logo.svg',
		lightLogo: './assets/images/logo gris.svg'
		};
		localStorage.setItem('sq_theme_configuration', JSON.stringify(configuration));
	}
}
