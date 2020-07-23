import {
	Component, OnInit, HostListener, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, Output,
	EventEmitter,
	ContentChild,
	TemplateRef,
	ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/utils/util.service';
@Component({
	selector: 'sq-chart-map-shared',
	templateUrl: './chart-world-map.component.html',
	styleUrls: ['./chart-world-map.component.scss'],
	providers: [DecimalPipe],
	encapsulation: ViewEncapsulation.None
})
export class ChartWorldMapSharedComponent implements OnInit, OnChanges {
	// Avtive
	public active = d3.select(null);
	public activeCountry = null;
	// Zoom
	public zoom;
	// Tooltip
	public toolTip;
	// Scroll
	public scroll;
	// Countries
	public countries: any;
	// States
	public states: any;
	// Map projecttion
	public projection;
	// D3 selector
	public _selectorD3: any;
	// map layer
	public mapLayer: any;
	// Country layer
	public countryLayer: any;
	// Scale
	public scale = 1;
	public wrapperHeight = 'auto';
	// Default options
	public defaultOptions: any = {
		dimensions: {
			width: 1024,
			height: 768
		},
		arrowHeight: 10,
		countryActiveColor: '#F8CB1C',
		countryColor: '#9B9B9B',
		strokeStateColor: '#3B3B3B'
	};
	public containerSize = {
		width: 0,
		height: 0
	};

	public cities = [];
	public citySelect;
	public countrySelect;

	public windowSize;
	public isMobile = false;

	@ViewChild('modalCities')
	template: TemplateRef<any>;

	// Inputs
	@Input() title = 'Geolocation';
	@Input()
	public options: any = {};
	@Input()
	public countriesActives: any;
	@Input()
	public statesActives: any;
	@Input()
	public fitContainer = 'width';
	@Input()
	public minHeight = 300;
	// Output
	@Output()
	chartMapOnClickCountry = new EventEmitter();
	@Output()
	chartMapOnClickCity = new EventEmitter();
	// Topojson
	@Input()
	topojson: any;
	// Viewchilds
	@ViewChild('wordMap')
	wordMapEl: ElementRef;
	// Constructor
	constructor(
		private _utilService: UtilService,
		public _decimalPipe: DecimalPipe,
		private modalService: NgbModal

	) { }
	// Init
	ngOnInit() {
		this.setWindowSize();
		d3.select(this.wordMapEl.nativeElement).select('.world-map').remove();
		this.createTooltip();
		//   this.buildMap();
	}
	// Changes
	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.countriesActives) {
			const countriesActives = changes.countriesActives;
			if (countriesActives && !countriesActives.firstChange) {
				this.resetZoom();
				this.setActiveCountries();
			}
		}
	}
	// Build map
	buildMap() {
		// Set options
		Object.assign(this.defaultOptions, this.options);
		// Prepare map
		this.preparateMap();
		// Zoom
		this.buildZoom();
		// Projection
		this.generateProjection();
		// Build map
		this.generateMapCountries();
		// Set active countries
		this.setActiveCountries();
	}
	// Set size container
	protected setSizeContainer() {
		let cWidth, cHeight;
		if (this.fitContainer === 'width') {
			cWidth = this.wordMapEl.nativeElement.offsetWidth;
			cHeight = (cWidth * this.defaultOptions.dimensions.height) / this.defaultOptions.dimensions.width;
		}
		if (this.fitContainer === 'height') {
			cHeight = this.wordMapEl.nativeElement.offsetHeight;
			if (cHeight <= 0) {
				cHeight = this.minHeight;
			}
			cWidth = (cHeight * this.defaultOptions.dimensions.width) / this.defaultOptions.dimensions.height;
		}
		this.containerSize.width = cWidth;
		this.containerSize.height = cHeight;
	}
	// Prepare map
	protected preparateMap() {
		this.setSizeContainer();
		this._selectorD3 = d3.select(this.wordMapEl.nativeElement).append('svg');
		this._selectorD3.attr('class', 'world-map');
		this.calculateScale();
		this.setSizesMap();
		// .attr('preserveAspectRatio', 'xMinYMin');
	}
	// Build zomm
	protected buildZoom() {
		this.zoom = d3.zoom()
			// no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
			// .translate([0, 0])
			// .scale(1)
			.scaleExtent([1, 40])
			.on('zoom', this.zoomed.bind(this));

		// this._selectorD3.call(this.zoom);

	}
	// Depreacted after add zoom
	// Calculate scale
	protected calculateScale() {
		let scale = 1;
		if (this.containerSize.width < this.defaultOptions.dimensions.width) {
			scale = (this.containerSize.width * 1) / this.defaultOptions.dimensions.width;
		}
		// d3.select(this.wordMapEl.nativeElement).style('transform', `scale(${scale})`);
		// this.wrapperHeight = this.defaultOptions.dimensions.height * scale + 'px';
	}
	// Set sizes map
	protected setSizesMap() {
		this._selectorD3
			.attr('width', this.containerSize.width)
			.attr('height', this.containerSize.height)
			.attr('viewBox', `${0} ${0} ${this.defaultOptions.dimensions.width} ${this.defaultOptions.dimensions.height}`);
	}
	// Generate projection
	protected generateProjection() {
		// Define map projection
		this.projection = d3.geoMercator()
			.scale(this.defaultOptions.dimensions.width / 2 / Math.PI)
			// .scale(130)
			// .rotate([-11, 0])
			.translate([(this.defaultOptions.dimensions.width) / 2, this.defaultOptions.dimensions.height * 1.35 / 2])
			.precision(.1);
	}
	// Generate map
	protected generateMapCountries() {
		this.countries = topojson.feature(this.topojson, this.topojson.objects.countries);
		// Define default path generator
		// path translates GeoJson into svg path
		const geoGenerator = d3.geoPath().projection(this.projection);
		// Map layer
		this.mapLayer = this._selectorD3.append('g').classed('map-layer', true);
		// Draw the map
		this.mapLayer
			.append('g')
			.attr('class', 'boundary-countries')
			.selectAll('.boundary-countries')
			.data(this.countries.features.filter(c => c.properties.ADM0_A3 !== 'ATA'))
			.enter()
			.append('path')
			.attr('class', 'country')
			.attr('id', (d: any) => {
				const iso_a3 = d.properties.ADM0_A3;
				return iso_a3;
			})
			.attr('country-name', (d: any) => {
				return d.properties.NAME;
			})
			.attr('country-name-long', (d: any) => {
				return d.properties.NAME_LONG;
			})
			// set the color of each country
			.attr('fill', (d: any) => {
				return this.defaultOptions.countryColor;
			})
			.on('mouseover', (d, i, n) => {
				const hasZoom = this._selectorD3.classed('zoomed');
				const target = d3.event.target;
				if (target.classList.contains('active') && !target.classList.contains('active-zoom') && !hasZoom) {


					// const computedStyle = n[i].getBoundingClientRect();
					this.showTooltipCountry(d, target);
				}

			})
			.on('mouseleave', (d, i) => {
				// const target = d3.event.target;
				this.hideTooltip();
			})
			.on('click', (d, i) => {
				const target = d3.event.target;
				if (target.classList.contains('active')) {
					// Iso a3
					const iso_a3 = d.properties.ADM0_A3;
					// States current country
					const countryClick = this.countriesActives.filter(c => c.iso_a3 === iso_a3);
					// Hide tooltip
					this.hideTooltip();
					// Zoom
					this.clicked(target, d, countryClick[0]);
					// Emit
					this.chartMapOnClickCountry.emit(countryClick[0]);
				}
			})
			.attr('d', geoGenerator);
	}
	// Generate states
	protected generateMapStates(states) {
		// Remove
		this.mapLayer
			.selectAll('.boundary-states')
			.remove();

		this.mapLayer
			.append('g')
			.attr('class', 'boundary-states')
			.selectAll('.boundary-states')
			.data(states)
			.enter()
			.append('circle')
			.attr('class', 'city')
			.attr('cx', (d) => {
				return this.projection([d.lng, d.lat])[0];
			})
			.attr('cy', (d) => {
				return this.projection([d.lng, d.lat])[1];
			})
			.attr('r', 1.5)
			.attr('data-city-id', (d: any) => {
				return d.id;
			})
			.style('fill', '#9b9b9b')
			.style('stroke', '#fff')
			.style('stroke-width', '2.5')
			.style('stroke-opacity', '0.47')
			.on('mouseover', (d) => {
				const target = d3.event.target;

				this.showTooltipCity(d, target);

        d3.select(target)
          .style('fill', '#000000')
          .raise();
			})
			.on('mouseleave', (d, i) => {
				this.hideTooltip();
				const target = d3.event.target;
        d3.select(target).style('fill', '#9b9b9b');
			});

	}
	// Set active countries
	public setActiveCountries() {
		this._selectorD3.selectAll('.country').classed('active', false);
		this.countriesActives.forEach(country => {
			const iso3Country = country.iso_a3.toUpperCase();
			const countryMap = this._selectorD3.select(`#${iso3Country}`);
			countryMap.classed('active', 'true');
		});

	}
	// Click
	public clicked(target, d, countryClick) {
		this.activeCountry = countryClick;
		// States of countru click
		const states = countryClick ? countryClick.cities : [];
		// Geo generator
		const geoGenerator = d3.geoPath().projection(this.projection);
		// Reset if the same
		if (this.active.node() === target) {
			return this.resetZoom();
		}
		this.active.classed('active-zoom', false);
		this.active = d3.select(target).classed('active-zoom', true);
		// Add states
		this.generateMapStates(states);
		// Zoom
		const bounds = geoGenerator.bounds(d),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			scale = Math.max(1, Math.min(8, 0.9 /
				Math.max(dx / this.defaultOptions.dimensions.width, dy / this.defaultOptions.dimensions.height))),
			translate = [this.defaultOptions.dimensions.width / 2 - scale * x, this.defaultOptions.dimensions.height / 2 - scale * y];
		// Selector
		this._selectorD3.classed('zoomed', true);
		// Zoom
		this._selectorD3.transition()
			.duration(750)
			.call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
	}
	// Trigger country click outsise
	public triggerClickCountry(country) {
		this._selectorD3.select(`path#${country.iso_a3}`).dispatch('click');
	}
	// Trigger click outise
	public triggerClickCity(city) {
		d3.selectAll('.city').style('fill', '#9b9b9b');


		if (!this.activeCountry || this.activeCountry.iso_a3 !== city.country) {
			const countryClick = this.countriesActives.filter(c => c.iso_a3 === city.country)[0];
			this.triggerClickCountry(countryClick);
			setTimeout(() => {
			  // this._selectorD3.select(`#${city.id}`).dispatch('click');
			  const circle = this.wordMapEl.nativeElement.querySelector(`[data-city-id="${city.id}"]`);
			  const mouseoverEvent = new Event('mouseover');
			  circle.dispatchEvent(mouseoverEvent);
			}, 750);
	  
		  } else {
			const circle = this.wordMapEl.nativeElement.querySelector(`[data-city-id="${city.id}"]`);
			const mouseoverEvent = new Event('mouseover');
			circle.dispatchEvent(mouseoverEvent);
		  }
	  
		// this.citySelect = city;
		// if (!this.activeCountry || this.activeCountry.iso_a3 !== city.country) {
		// 	const countryClick = this.countriesActives.filter(c => c.iso_a3 === city.country)[0];
		// 	this.triggerClickCountry(countryClick);
		// 	setTimeout(() => {
		// 		// this._selectorD3.select(`#${city.id}`).dispatch('click');
		// 		// const circle = this.wordMapEl.nativeElement.querySelector(`[data-city-id="${city.id}"]`);
		// 		// const mouseoverEvent = new Event('mouseover');
		// 		// circle.dispatchEvent(mouseoverEvent);
		// 		this.countrySelect = this.countriesActives.filter(c => c.iso_a3 === city.country)[0];
		// 		// const target = d3.event.target;
		// 		// this.showTooltipCity(d, target);
		// 		// this.cities = Object.assign([], countryClick.cities);
		// 		// this.modalService.open(this.template, {
		// 		// 	windowClass: 'cities-modal'
		// 		// });
		// 	}, 750);

		// } else {
		// 	this.countrySelect = this.countriesActives.filter(c => c.iso_a3 === city.country)[0];

		// 	const circle = this.wordMapEl.nativeElement.querySelector(`[data-city-id="${city.id}"]`);
		// 	// const mouseoverEvent = new Event('mouseover');
		// 	// circle.dispatchEvent(mouseoverEvent);
		// 	// this.cities = Object.assign([], this.activeCountry.cities);
		// 	// this.modalService.open(this.template, {
		// 	// 	windowClass: 'cities-modal'
		// 	// });

		// }

		// const target = d3.event.target;
		// this.showTooltipCity(this.citySelect, target);
	}
	// Reset zoom
	resetZoom() {
		this.activeCountry = null;
		// Remove
		this.mapLayer
			.selectAll('.boundary-states')
			.remove();
		// Selector
		this._selectorD3.classed('zoomed', false);
		// Remove all
		this.active.classed('active-zoom', false);
		this.active = d3.select(null);
		this._selectorD3.transition()
			.duration(750)
			// .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
			.call(this.zoom.transform, d3.zoomIdentity); // updated for d3 v4
	}
	// Zoom function
	zoomed() {
		// g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
		// g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
		this.mapLayer.attr('transform', d3.event.transform); // updated for d3 v4
	}
	// Create tooltip
	protected createTooltip() {
		if (!this.toolTip) {
			this.toolTip = d3.select('body').append('div')
				.attr('class', 'd3-map-tooltip')
				.style('opacity', 0);
			// Content
			this.toolTip.append('div')
				.attr('class', 'd3-tooltip-content');
		}
	}
	// Show tooltip Country
	protected showTooltipCountry(d, target) {
		// Refresh scroll
		this.scroll = this._utilService.getScrollParent(this.wordMapEl.nativeElement, true);
		// Target position
		const boundingClientRect = target.getBoundingClientRect();
		// Get the content
		const tooltipContent = this.toolTip.select('.d3-tooltip-content');
		const country = this.countriesActives.filter(c => c.iso_a3 === d.properties.ADM0_A3)[0];
		// Replace
		const icon = country.growth === 'up' ? 'icon-up' : 'icon-down';
		const colorIcon = country.growth === 'up' ? 'text-success' : 'text-danger';
		tooltipContent.html(`<div class="tooltip-tile">
                              <span class="title">
                                ${country.name}
                                </span>
                            </div>
                            <div class="tooltip-content">
                              <div class="country-value">
                                  <span class="icon ${icon} ${colorIcon}"></span>
                                  <span class="value">${this._decimalPipe.transform(country.value, '2.')}</span>
                              </div>
                            </div>
                         `);
		// Tooltip
		this.toolTip.style('display', 'block');
		// Get tooltip sizes
		const computedStyle = this.toolTip.node().getBoundingClientRect();
		// Position
		let scrollTop = 0;
		if (document.body === this.scroll) {
			const doc = document.documentElement;
			scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
		} else {
			scrollTop = this.scroll.scrollTop;
		}
		const tooltipLeft = boundingClientRect.left - (computedStyle.width / 2) + (boundingClientRect.width / 2);
		const tooltipTop = boundingClientRect.top - computedStyle.height - this.defaultOptions.arrowHeight + scrollTop;
		// Posisionated
		this.toolTip
			.style('left', `${tooltipLeft}px`)
			.style('top', `${tooltipTop}px`);
		// Show
		setTimeout(() => {
			this.toolTip.transition().duration(300).style('opacity', 1);
		});

	}
	// Show tooltip Country
	protected showTooltipCity(city, target) {

		// Path parent
		const path = this.wordMapEl.nativeElement.querySelector(`path#${city.country}`);
		// Refresh scroll
		this.scroll = this._utilService.getScrollParent(this.wordMapEl.nativeElement, false);
		// Target position
		const boundingClientRect = target.getBoundingClientRect();
		// Get the content
		const tooltipContent = this.toolTip.select('.d3-tooltip-content');
		// Inner list
		let innerListHtml = '<ul class="legends">';
		this.countrySelect = this.countriesActives.filter(c => c.iso_a3 === city.country)[0];
		const cities = Object.assign([], this.countrySelect.cities);
		const indexCity = cities.findIndex(c => c.id === city.id);
		cities.splice(indexCity, 1).slice(0, 4);
		cities.unshift(city);
		// cities.forEach((c, index) => {
		const color = this.defaultOptions.countryColor;
		const value = cities[0].value;
		const legend = cities[0].name;
		const icon = cities[0].growth === 'up' ? 'icon-up' : 'icon-down';
		const colorIcon = cities[0].growth === 'up' ? 'text-success' : 'text-danger';
		// const classSelected = index === 0 ? 'selected' : '';
		innerListHtml += `<li class="selected">
                                  <span class="legend">
                                      <span class="legend-indicator"></span>
                                      <span class="legend-label">
                                          <span class="legend-text-wrapper">
                                            <span class="legend-text">
                                              ${legend}
                                            </span>
                                          </span>
                                          <span class="legend-value-wrapper">
                                            <span class="legend-value">
                                                <span class="icon ${icon} ${colorIcon}"></span>
                                               <span class="value"> ${this._decimalPipe.transform(value, '2.')}</span>
                                              </span>
                                          </span>
                                          <span class="legend-line-dotted"></span>
                                       </span>
                                   </span>
                              </li></ul>`;
		// });

		// const formattedMonth = moment(legendsData.key, 'MM').format('MMMM');
		tooltipContent.html(`<div class="tooltip-tile">
                              <span class="title">
                                ${this.countrySelect.name}
                                </span>
                            </div>
                            <div class="tooltip-content">
                              ${innerListHtml}
                            </div>
                         `);
		// Tooltip
		this.toolTip.style('display', 'block');
		this.toolTip.style('z-index', '2');

		// if(this.isMobile) {
		// 	this.toolTip.style('min-width', '100px');
		// 	this.toolTip.style('max-width', '170px');

		// } else {
			this.toolTip.style('min-width', '250px');
		// }
		// Get tooltip sizes
		const computedStyle = this.toolTip.node().getBoundingClientRect();
		// Position
		let scrollTop = 0;
		if (document.body === this.scroll) {
			const doc = document.documentElement;
			scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
		} else {
			scrollTop = this.scroll.scrollTop;
		}
		let tooltipLeft = boundingClientRect.left - computedStyle.width - 14;
		// const tooltipLeft = boundingClientRect.left - (computedStyle.width / 2) + (boundingClientRect.width / 2);
		let tooltipTop = boundingClientRect.top - (computedStyle.height / 2) + (boundingClientRect.height / 2) + scrollTop;
		if (tooltipLeft < 0 && tooltipLeft > -35) {
			tooltipLeft = 0;
			this.toolTip.classed('left', true);
			this.toolTip.classed('right', false);

		} else {
			if(tooltipLeft < -10) {
				this.toolTip.classed('right', true);
				this.toolTip.classed('left', false);
				tooltipLeft = tooltipLeft + computedStyle.width + 40;
				tooltipTop = tooltipTop - 10;

			}else {
				this.toolTip.classed('left', true);
				this.toolTip.classed('right', false);


			}
		}
		// Posisionated

		this.toolTip
			.style('left', `${tooltipLeft}px`)
			.style('top', `${tooltipTop}px`);
		// Show
		setTimeout(() => {
			this.toolTip.transition().duration(300).style('opacity', 1);
		});

	}

	// Hide tooltip
	protected hideTooltip() {
		// Add class
		this.toolTip.classed('left', false);
		this.toolTip.transition().duration(300).style('opacity', 0);
		this.toolTip.style('display', 'none');
		this.toolTip.style('min-width', '');
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

	@HostListener('window:resize') onresize() {
		setTimeout(() => {
			this.setWindowSize();
			this.setSizeContainer();
			this.setSizesMap();
		});
	}

}
