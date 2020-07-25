import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChartWorldMapSharedComponent } from '../shared/chart-world-map/chart-world-map.component';
import * as d3 from 'd3';
import { SQUINT_RANK_COUNTRIES } from '../data/mock-geolocalization';

/**
 * @export
 * @class ComponentsComponent
 */
@Component({
	selector: 'sq-components',
	templateUrl: './components.component.html',
	styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements OnInit {
	public section;
	public channel;
	public windowSize;
	public isMobile;
	public cornerRounded1200;
	public cornerRounded1024;
	public cornerRoundedTablet;
	public cornerRoundedMobile;
	public paddingForBars;
	public showGraph = false;

	// Geolocalization
	public countriesActivesMap = [];
	// Ranking countries
	public rankingCountries = [];
	public selectedCountry: any;
	// Ranking
	public rankingCities = [];
	public topojson;

	@ViewChild('squintWorldMap') squintWorldMap: ChartWorldMapSharedComponent;
	
	constructor(
		private _router: Router
	) {
		// Router events
		this._router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				const url = event.url;
				const urlParts = url.split('/');

				let section = urlParts[3];
				if (!section) {
					section = 'pulse';
				}
				let channel = urlParts[2];
				if (!section) {
					channel = 'facebook';
				}

				if (channel === 'clipping') {
					section = 'clipping';
					channel = 'facebook';
				}

				this.section = section;
				this.channel = channel;

			}
		});
	}

	ngOnInit() {
		this.setWindowSize()
		this.setPadding();
		d3.json('assets/topojson/ne_110m_admin_0_countries.json').then((data: any) => {
			// setTimeout(() => {
			this.squintWorldMap.topojson = data;
			this.squintWorldMap.buildMap();
			setTimeout(() => {
				this.initMapData();
			});
			// });
		});

		setTimeout(() => {
			this.showGraph = true;
		})
	}


	@HostListener('window:scroll', ['$event'])
	scroll($event: Event) {
		// window.onscroll = function() {
		let currentScrollPos = window.pageYOffset;


		if (currentScrollPos > 10) {
			document.getElementById('nav-main').classList.add('scroll-on');
			document.getElementById('nav-secondary').classList.add('scroll-on');
		} else {
			document.getElementById('nav-main').classList.remove('scroll-on');
			document.getElementById('nav-secondary').classList.remove('scroll-on');
		}
		//   }
	}

	// On select country
	rankingOnSelectRow(row: any) {
		const index = this.rankingCountries.findIndex(c => c.id === row.id);
		this.selectedCountry = this.rankingCountries[index];
		this.rankingCities = this.selectedCountry.cities;
		this.squintWorldMap.triggerClickCountry(this.selectedCountry);
	}
	// On select city
	rankingCityOnSelectRow(row: any) {
		const city = this.rankingCities.find(c => c.id === row.id);
		this.squintWorldMap.triggerClickCity(city);
	}
	// On change page
	onChangePage(page) {
		const itemPerPage = 5;
		const limit = page * itemPerPage;
		this.countriesActivesMap = this.rankingCountries.slice(limit - itemPerPage, limit);
	}
	// Country
	chartMapOnClickCountry(country) {
		const index = this.rankingCountries.findIndex(r => r.id === country.id);
		this.selectedCountry = this.rankingCountries[index];
		this.rankingCities = this.selectedCountry.cities;
	}

	// Init map data
	private initMapData() {
		this.rankingCountries = SQUINT_RANK_COUNTRIES;
		this.initRankingCountry();
	}
	// Init ranking country
	private initRankingCountry() {
		if (this.rankingCountries.length > 0) {
			this.selectedCountry = this.rankingCountries[0];
			this.rankingCities = this.selectedCountry.cities;
			this.countriesActivesMap = Object.assign([], this.rankingCountries.slice(0, 5));
		}
	}

	protected setWindowSize() {
		this.windowSize = 'sm';
		this.isMobile = true;
		if (window.innerWidth >= 1200) {
			this.windowSize = 'xl';
			this.isMobile = false;
		} else if (window.innerWidth >= 992) {
			this.windowSize = 'lg';
			this.isMobile = false;
		} else if (window.innerWidth >= 768) {
			this.windowSize = 'md';
			this.isMobile = false;
		} else if (window.innerWidth >= 576) {
			this.windowSize = 'sm';
			this.isMobile = true;
		}
	}

	protected setPadding() {
		
				this.cornerRounded1200 = 6;
				this.cornerRounded1024 = 5;
				this.cornerRoundedTablet = 4;
				this.cornerRoundedMobile = 3;
				// this.paddingForBars = 0.8;
				switch (this.windowSize) {
					case 'xl':
						this.paddingForBars = 0.8;
						break;
					case 'lg':
						this.paddingForBars = 0.8;
						break;
					case 'md':
						this.paddingForBars = 0.75;
						break;
					case 'sm':
						this.paddingForBars = 0.8;
						break;
				}
				
		
	}

	@HostListener('window:resize') onresize() {
		this.setWindowSize();
		this.setPadding();
	}

}
