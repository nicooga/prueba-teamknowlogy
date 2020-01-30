import {
	Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, HostListener, ViewEncapsulation,
	OnChanges, SimpleChanges, SimpleChange
} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { DecimalPipe, Location } from '@angular/common';
import { NumberSuffixesSharedPipe } from 'src/app/pipes/number-suffixes-pipe/number-suffixes.pipe';

@Component({
	selector: 'sq-graph-vertical-individual-shared',
	templateUrl: './graph-vertical-individual.component.html',
	styleUrls: ['./graph-vertical-individual.component.scss']
})
export class GraphVerticalIndividualSharedComponent implements OnInit, OnDestroy, OnChanges {

	public widthGraph;
	public heightGraph;
	public elementGraph;
	public elementParent;
	public svg;
	public margin = { top: 0, right: 10, bottom: 30 };
	public x0;
	public y0;
	public color;
	public xAxis;
	public yAxisLeft;
	public rangeData;
	public tip;
	public paddingLabel;
	public isMobile = false;
	public paddingResponsive;
	public tickXPadding;
	public cornerRoundedX = 6;
	public cornerRoundedY = 6;
	public positionXAxisImagesResponsive;
	public bars;
	public firstTimeReload;
	public graph;
	public windowSize;
	public suffixY;
	public paddingOuterResponsive;
	public paddingInnerResponsive;

	@Input() data = [
		{ group: 'group-1', impressions: 5463 },
		{ group: 'group-2', impressions: 4353 },
		{ group: 'group-3', impressions: 7656 },
		{ group: 'group-4', impressions: 7656 }
	];
	@Input() groups = ['group-1', 'group-2', 'group-3', 'group-4'];
	@Input() colors = ['#3B3B3B', '#F8CB1C', '#66ffff', '#66ff66'];
	@Input() colorsHover = ['#222222', '#DAAF07', '#33ffff', '#33ff33'];
	@Input() descriptionGroups = ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4'];
	@Input() isAxisImages = false;
	@Input() marginLeft = 50;
	@Input() maxBarWidth = 13;
	@Input() showFormatYAxis = false;
	@Input() formatYAxis = '~s';
	@Input() labelXAxis = 'Edad';
	@Input() labelYAxis = 'Vistas';
	@Input() showLabelX = true;
	@Input() showLabelY = true;
	@Input() paddingX01200 = 0.5;
	@Input() paddingX01024 = 0.5;
	@Input() paddingX0Tablet = 0.5;
	@Input() paddingX0Mobile = 0.5;
	@Input() barWidth = 7.2;
	@Input() showNameAxisXImage = false;
	@Input() showIconOnTop = false;
	@Input() iconToShowOnTop = 'zmdi zmdi-star';
	@Input() iconToShowOnTopColor = 'black';
	@Input() positionXImagesMobile = '-9';
	@Input() positionXImagesTablet = '-9';
	@Input() positionXImages1024 = '-9';
	@Input() positionXImages1200 = '-9';
	@Input() cornerRoundedMobile = 4;
	@Input() cornerRoundedTablet = 4;
	@Input() cornerRounded1024 = 4;
	@Input() cornerRounded1200 = 4;
	@Input() paddingInnerMobile = 0.75;
	@Input() paddingInnerTablet = 0.75;
	@Input() paddingInner1024 = 0.75;
	@Input() paddingInner1200 = 0.75;
	@Input() paddingOuterMobile = 0.35;
	@Input() paddingOuterTablet = 0.35;
	@Input() paddingOuter1024 = 0.35;
	@Input() paddingOuter1200 = 0.35;
	@Input() showAxisTransform = false;
	@Input() maxValueAxisY;
	@Input() sameColorIconAndBar = false;
	@Input() showTextShort = false;
	@Input() ticksAmount = 7;
	@Input() extraTextTooltip = [];
	@Input() id;
	@Input() colorHover = '#6254E3';
	@Input() showAxisX = true;

	@ViewChild('graphVerticalIndividualShared')
	private graphVerticalContainer: ElementRef;


	constructor(
		private elRef: ElementRef,
		private ns: NumberSuffixesSharedPipe,
		private dp: DecimalPipe,
		private location: Location
	) { }

	ngOnInit() {
		this.firstTimeReload = true;
		this.setWindowSize();
		this.createTooltip();
		this.getPaddingLabel();
		setTimeout(() => {
			this.createGraphVertical();
			this.startAnimation();
		});
	}

	ngOnDestroy() {
		if (this.tip) {
			this.tip.destroy();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		const data: SimpleChange = changes.data;

		if (data && !data.firstChange) {

			this.firstTimeReload = true;
			this.createGraphVertical();
			this.startAnimation();

		}

	}

	createTooltip() {
		this.tip = d3Tip()
			.attr('class', 'pulse-graph-tooltip')
			.direction((d, i) => {
				if (d.i >= Math.round((this.data.length - 2) / 2)) {
					return 'w';
				} else {
					return 'e';
				}
			})
			.offset((d, i) => {
				if (d.i >= Math.round((this.data.length - 2) / 2)) {
					return [-15, -15];
				} else {
					return [-15, 15];
				}
			})
			.html((d: any) => {
				const html =
					'<div class="header-tooltip">' + this.descriptionGroups[d.i] + ' ' + this.extraTextTooltip[d.i] + '</div>' +

					'<div class="body-tooltip">' + `<div class="item-tooltip">
                       <div class="title-item">
                         <div class="circle" style="background-color: ${this.color(d.d.group)}"></div>
                         ${ this.dp.transform(d.d.impressions)}
                       </div>
                    </div></div>`;
				// });

				return html;
			});

		// .attr('class', 'd3-tip')
		// .offset([-10, 0])
		// .html((d) => {
		//   return '<h1><div class="circle" style="background-color: ' + this.color(d.d.group) + '"></div>'
		//     + this.descriptionGroups[d.i] + '</h1><p class="text-align-c">' + d.d.impressions + '</p>';
		// });
	}

	getPpalFormatY(maxValue) {
		const aux1 = this.ns.transform(maxValue).split(' ').pop();
		this.suffixY = aux1;
	}

	getFormatText(format, number, suffix?) {
		switch (format) {
			case 'currency':
				return '$ ' + this.ns.transform(number, suffix);
			case 'percentage':
				return d3.format('.0%');
			case 'prefix':
				return this.ns.transform(number, suffix);
				break;
		}
	}

	createGraphVertical() {
		this.elementGraph = this.graphVerticalContainer.nativeElement;
		this.elementParent = this.elRef.nativeElement.parentElement;

		d3.select(this.elementGraph).select('svg').remove();

		this.widthGraph = this.elementParent.offsetWidth - this.marginLeft - this.margin.right;

		const style = window.getComputedStyle(this.elementParent, null);
		const paddingTop = parseFloat(style.paddingTop.replace('px', ''));
		const paddingBottom = parseFloat(style.paddingBottom.replace('px', ''));

		const calculatedHeight = this.elementParent.offsetHeight -
			(this.margin.top + this.margin.bottom + paddingBottom + paddingTop);

		if (this.showIconOnTop) {
			this.heightGraph = calculatedHeight - this.margin.top - this.margin.bottom - this.maxBarWidth;
		} else {
			this.heightGraph = calculatedHeight - this.margin.top - this.margin.bottom;
		}


		this.x0 = d3.scaleBand().rangeRound([0, this.widthGraph]).paddingInner(this.paddingInnerResponsive)
			.paddingOuter(this.paddingOuterResponsive);

		// this.x1 = d3.scaleBand();

		this.y0 = d3.scaleLinear().range([this.heightGraph, 0]);

		this.color = d3.scaleOrdinal(this.colors);

		// if (this.isMobile) {
		this.xAxis = d3.axisBottom(this.x0).tickPadding(this.tickXPadding);

		this.xAxis.tickSize(-this.heightGraph, 0, 0).tickSizeOuter(0);
		// } else {
		//   this.xAxis = d3.axisBottom(this.x0).tickSize(0).tickPadding(27);
		// }

		// this.data.forEach(d => {
			// if(this.data.length > 0) {
			// 	this.hasData = true;
			// }
		// });
		let maxY0;
		
		if(this.data.length > 0) {
			maxY0 = d3.max(this.data, (d, i) => d.impressions);
		} else {
			maxY0 = 100;
		}

		if (maxY0 === 0) {
			maxY0 = 100;
		}

		const formatValue = d3.format(this.formatYAxis);

		const minY0 = d3.min(this.data, (d, i) => d.impressions);
		// let maxY0 = d3.max(this.data, (d, i) => d.impressions);
		// if (maxY0 === 0) {
		// 	maxY0 = 100;
		// }

		this.getPpalFormatY(maxY0);
		const tickStepY0 = (maxY0 - 0) / (this.ticksAmount);
		maxY0 = maxY0 + tickStepY0;
		const stepY0 = Math.ceil(tickStepY0 / this.ticksAmount) * this.ticksAmount;

		this.yAxisLeft = d3.axisLeft(this.y0)
			.tickSizeInner(-this.widthGraph)
			.ticks(stepY0).tickValues(d3.range(0, maxY0 + stepY0, stepY0))
			.tickSizeOuter(0)
			.tickPadding(10)
			.tickFormat((d: any) => this.getFormatText('prefix', d, this.suffixY));

		// if ((this.formatYAxis && this.isMobile) || this.showFormatYAxis) {
		//   this.yAxisLeft
		//     .tickFormat((d: any) => formatValue(d));
		// }

		this.svg = d3.select(this.elementGraph).append('svg')
			.attr('width', this.widthGraph + this.marginLeft + this.margin.right)
			.attr('height', this.heightGraph + this.margin.top + this.margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + this.marginLeft + ',' + this.margin.top + ')');

		this.svg.call(this.tip);

		let maxValue = d3.max(this.data, (d) => d.impressions);

		this.x0.domain(this.data.map((d) => d.group));

		if (this.maxValueAxisY) {
			this.y0.domain([0, this.maxValueAxisY]);

		} else {

			if (maxValue === 0) {
				maxValue = 100;
			}
			this.y0.domain([-(+maxValue * .02), maxValue]);
		}

		this.svg.append('defs')
			.append('linearGradient')
			.attr('gradientUnits', 'userSpaceOnUse').attr('id', 'gradient-graph-vertical-individual-' + this.id)
			.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', -this.y0(0))
			.selectAll('stop')
			.data([
				{ offset: '0', backgroundColor: this.colorHover, opacity: 0.1 },
				{ offset: '40', backgroundColor: this.colorHover, opacity: 0.1 },
				// {offset: "19", backgroundColor: "lightgray", opacity: 0.4},
				{ offset: '80', backgroundColor: this.colorHover, opacity: 0.05 },
				{ offset: '90', backgroundColor: this.colorHover, opacity: 0.02 },
				{ offset: '100', backgroundColor: this.colorHover, opacity: 0 }
			]) // <= your new offsets array
			.enter().append('stop')
			.attr('offset', function (d) { return d.offset + '%'; })
			.attr('style', function (d) { return 'stop-color:' + d.backgroundColor + ';stop-opacity:' + d.opacity; });



		const axisX = this.svg.append('g')
			.attr('class', 'squint-graph-vertical-individual grid-x')
			.attr('transform', `translate(${0}, ${this.heightGraph})`)
			.call(this.xAxis);

		axisX.selectAll('.tick line')
			.attr('id', (d, i) => `axisXlineVertical_${i}_${this.id}`)
			.style('stroke-width', (d) => this.widthGraph / this.data.length + 'px')
			.style('stroke', `url(${this.location.path()}#gradient-graph-vertical-individual-${this.id})`)
			.style('opacity', 0);

		axisX.selectAll('.tick text')
			.style('opacity', (d) => {
				if (this.showAxisX) {
					return 1;
				} else {
					return 0;
				}
			})
			// .style('text-anchor', 'middle')
			.attr('class', 'squint-graph-vertical-individual text-axis').text((d, i) => {
				if (this.showTextShort) {
					return this.descriptionGroups[i].slice(0, 8) + '...';
				} else {
					return this.descriptionGroups[i];
				}
			});


		if (this.showAxisTransform) {
			axisX
				.attr('dx', () => {
					if (this.showTextShort) {
						return '-4.5em';
					} else {
						return '-3.5em';
					}
				})
				.attr('dy', '-2em')
				.attr('transform', 'rotate(-65)');

		}

		// if (this.isMobile) {
		//   axisX
		//     .attr('dx', () => {
		//       if (this.showTextShort) {
		//         return '-4.5em';
		//       } else {
		//         return '-3.5em';
		//       }
		//     })
		//     .attr('dy', '0em')
		//     .attr('transform', 'rotate(-65)');
		// }

		if (this.isAxisImages) {
			this.svg.select('.grid-x').selectAll('text').remove();


			const images = this.svg.select('.squint-graph-vertical-individual .grid-x')
				.attr('transform', `translate(${0}, ${this.heightGraph})`)
				.selectAll('.tick')
				.data(this.data);

			images.append('svg:image')
				.attr('xlink:href', (d) => d.group)
				.attr('width', 20)
				.attr('height', 20)
				.attr('x', '-9')
				.attr('y', '20');

			if (this.showNameAxisXImage) {
				images.append('text').text(function (d) {
					return d.imageDescription;
				})
					.attr('y', '60')
					.attr('class', 'squint-graph-vertical-individual text-label-image')
					.style('text-anchor', 'middle');
			}

		}


		const ticksY = this.svg.append('g')
			.attr('class', 'squint-graph-vertical-individual grid-y')
			.call(this.yAxisLeft);

		ticksY.selectAll('.tick line')
			.style('opacity', (d, i) => {
				if (i === 0) {
					return 0;
				}
			});

		// ticksY.selectAll('.tick line')
		// .style('opacity', (d, i) => i === 0 ? 0 : 0.1);

		ticksY.selectAll('.tick text')
			.attr('y', '-4')
			.attr('class', 'squint-graph-vertical-individual text-axis')
			.style('opacity', (d, i) => i === 0 ? 0 : 1);

		this.putLabels();

		this.graph = this.svg.selectAll('.rangeX')
			.data(this.data)
			.enter()
			.append('g')
			.attr('class', 'g');

		const _this = this;

		if (this.firstTimeReload) {
			this.bars = this.graph
				.append('path')
				// .attr('width', Math.min.apply(null, [this.x0.bandwidth(), this.maxBarWidth]))
				// .attr('x', (d) => {
				//   // return this.x1(d.group);
				//   return this.x0(d.group) + (this.x0.bandwidth() - d3.min([this.x0.bandwidth(), this.maxBarWidth])) / 2;
				// })
				// // .attr('dy', '0.32em')
				// .attr('y', (d) => this.heightGraph)
				// .attr('rx', this.cornerRoundedX)         // set the x corner curve radius
				// .attr('ry', this.cornerRoundedY)
				// .style('fill', (d) => this.color(d.group))
				// .attr('height', 0);
				.attr('d', d => `
        M${this.x0(d.group)},${this.y0(d.impressions) + this.cornerRoundedY}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${-this.cornerRoundedY}
        h${this.x0.bandwidth() - 2 * this.cornerRoundedX}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${this.cornerRoundedY}
        v${this.heightGraph - this.y0(d.impressions) - this.cornerRoundedY}
        h${-(this.x0.bandwidth())}Z
      `)
				.style('fill', (d) => this.color(d.group));

			// .on('mouseover', function (d, i) {
			//   d3.select(this).style('opacity', '.7').style('cursor', 'pointer');
			//   _this.tip.show({ d, i }, this);
			// })
			// .on('mouseout', function (d) {
			//   d3.select(this).style('opacity', '1').style('cursor', 'none');
			//   _this.tip.hide(d, this);
			// });
		} else {
			this.bars = this.graph
				.append('path')
				// .attr('width', Math.min.apply(null, [this.x0.bandwidth(), this.maxBarWidth]))
				// .attr('x', (d) => {
				//   return this.x0(d.group) + (this.x0.bandwidth() - d3.min([this.x0.bandwidth(), this.maxBarWidth])) / 2;

				// })
				// .attr('y', (d) => this.y0(d.impressions))
				// .attr('rx', this.cornerRoundedX)         // set the x corner curve radius
				// .attr('ry', this.cornerRoundedY)
				// .attr('height', (d) => this.heightGraph - this.y0(d.impressions))
				.attr('d', d => `
        M${this.x0(d.group)},${this.y0(d.impressions) + this.cornerRoundedY}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${-this.cornerRoundedY}
        h${this.x0.bandwidth() - 2 * this.cornerRoundedX}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${this.cornerRoundedY}
        v${this.heightGraph - this.y0(d.impressions) - this.cornerRoundedY}
        h${-(this.x0.bandwidth())}Z
      `)
				.style('fill', (d) => this.color(d.group));

		}


		if (this.showIconOnTop) {


			if (this.firstTimeReload) {
				this.graph.selectAll('foreignObject')
					.data(this.data)
					.enter().append('foreignObject')
					.attr('x', d => this.x0(d.group) + (this.x0.bandwidth() - d3.min([this.x0.bandwidth(), this.maxBarWidth])) / 2)
					.attr('y', this.heightGraph)
					// .attr('dy', '-0.2em')
					// .attr('dx', '-0.85em')
					.attr('width', this.maxBarWidth + 'px')
					.attr('height', 0)
					.html((d: any, i) => {
						if (d.markOnTop) {
							return '<i style="font-size:' + this.maxBarWidth + 'px; color: ' + this.getColorOfIconOnTop(i) +
								'; display: block; margin-left: 1px;" class="' + this.iconToShowOnTop + '">';
						} else {
							return '';
						}
					});
			} else {

				this.graph.selectAll('foreignObject')
					.data(this.data)
					.enter().append('foreignObject')
					.attr('x', d => this.x0(d.group) + (this.x0.bandwidth() - d3.min([this.x0.bandwidth(), this.maxBarWidth])) / 2)
					.attr('y', (d) => this.y0(d.impressions) - (this.maxBarWidth + 7))
					.attr('dy', '-0.2em')
					.attr('dx', '-0.85em')
					.attr('width', this.maxBarWidth + 'px')
					.attr('height', this.maxBarWidth + 'px')
					.html((d: any, i) => {
						if (d.markOnTop) {
							return '<i style="font-size:' + this.maxBarWidth +
								'px; color: ' + this.getColorOfIconOnTop(i) + '; display: block; margin: 1px;" class="' + this.iconToShowOnTop + '">';
						}
					});
			}
		}

		this.bars.on('mouseover', function (d, i) {
			_this.tip.show({ d, i }, document.querySelector(`#axisXlineVertical_${i}_${_this.id}`));
			d3.select(`#axisXlineVertical_${i}_${_this.id}`).style('opacity', 1);
			// d3.select(this).style('opacity', '.7').style('cursor', 'pointer').style('stroke', _this.colorsHover[i])
			//   .style('stroke-width', '1px');
			// _this.tip.show({ d, i }, this);
			// _this.tip.style('display', 'block');

		})
			.on('mouseout', function (d, i) {
				// d3.select(this).style('opacity', '1').style('cursor', 'none').style('stroke-width', '0px');
				_this.tip.hide(d, document.querySelector(`#axisXlineVertical_${i}_${_this.id}`));
				d3.select(`#axisXlineVertical_${i}_${_this.id}`).style('opacity', 0);
				_this.tip.style('top', '0px');
				_this.tip.style('left', null);
				// _this.tip.style('display', 'none');

			});
	}

	getColorOfIconOnTop(index) {
		if (this.sameColorIconAndBar) {
			return this.colors[index];
		} else {
			return this.iconToShowOnTopColor;
		}
	}

	startAnimation() {
		this.bars.transition()
			.duration(500)
			// .delay(function (d, i) { return 500 * i; })
			.attr('height', (d) => this.heightGraph - this.y0(d.impressions))
			.attr('y', (d) => this.y0(d.impressions));

		this.graph.selectAll('foreignObject')
			.transition()
			.duration(500)
			// .delay(function (d, i) { return 500 * i; })
			.attr('height', this.maxBarWidth + 'px')
			// .attr('height', (d) => this.heightGraph - this.y0(d.impressions))
			.attr('y', (d) => this.y0(d.impressions) - (this.maxBarWidth + 7));
	}

	putLabels() {
		if (this.showLabelX) {

			const labelX = this.svg.append('text')
				.style('text-anchor', 'end')
				// .style('fill', '#636363')
				.style('stroke', 'none')
				.attr('class', 'squint-graph-vertical-individual text-axis')
				.text(this.labelXAxis);
			if (!this.isMobile) {
				labelX
					.attr('transform',
						'translate(' + (this.widthGraph / 2) + ' ,' +
						(this.heightGraph + this.margin.top + this.margin.bottom + 30) + ')');
			} else {
				labelX
					.attr('transform',
						'translate(' + (this.widthGraph / 2) + ' ,' +
						(this.heightGraph + this.margin.top + this.margin.bottom + 35) + ')');
			}

		}

		if (this.showLabelY) {

			this.svg.append('text')
				.attr('transform',
					'translate(' + (-20) + ' ,' +
					0 + ')')
				.style('text-anchor', 'end')
				.text(this.labelYAxis)
				// .style('fill', '#636363')
				.style('stroke', 'none')
				.attr('class', 'squint-graph-vertical-individual text-axis');
		}
	}

	setWindowSize() {
		/**
			xs: 0,
			sm: 375px,
			md: 768px,
			lg: 1024px,
			xl: 1200px
		 */
		this.windowSize = 'sm';
		if (window.innerWidth >= 1200) {
			this.windowSize = 'xl';
		} else if (window.innerWidth >= 992) {
			this.windowSize = 'lg';
		} else if (window.innerWidth >= 768) {
			this.windowSize = 'md';
		} else if (window.innerWidth < 768) {
			this.windowSize = 'sm';
		}
	}

	getPaddingLabel() {
		if (this.windowSize === 'sm') {
			this.paddingLabel = 3;
			this.isMobile = true;
			if (window.innerWidth < 380) {
				// this.maxBarWidth = 5.2;
			} else {
				// this.maxBarWidth = 7.2;
			}
			this.paddingResponsive = this.paddingX0Mobile;
			this.positionXAxisImagesResponsive = this.positionXImagesMobile;
			this.cornerRoundedX = this.cornerRoundedMobile;
			this.cornerRoundedY = this.cornerRoundedMobile;
			this.paddingInnerResponsive = this.paddingInnerMobile;
			this.paddingOuterResponsive = this.paddingOuterMobile;
			this.tickXPadding = 25;
			// this.cornerRoundedY = 4;
			// this.cornerRoundedX = 4;
		}
		if (this.windowSize === 'md') {
			if (window.innerWidth <= 625) {
				// this.maxBarWidth = 5.2;
			} else {
				// this.maxBarWidth = 7.2;
			}
			if (window.innerWidth <= 800) {
				this.paddingResponsive = this.paddingX0Tablet - 0.1;
			} else {
				this.paddingResponsive = this.paddingX0Tablet;
			}
			this.paddingLabel = 2;
			this.isMobile = false;
			this.positionXAxisImagesResponsive = this.positionXImagesTablet;
			this.cornerRoundedX = this.cornerRoundedTablet;
			this.cornerRoundedY = this.cornerRoundedTablet;
			this.paddingInnerResponsive = this.paddingInnerTablet;
			this.paddingOuterResponsive = this.paddingOuterTablet;
			this.tickXPadding = 25;
		}
		if (this.windowSize === 'lg') {
			this.paddingLabel = 4;
			// this.maxBarWidth = 7.2;
			this.isMobile = false;
			this.paddingResponsive = this.paddingX01024;
			this.positionXAxisImagesResponsive = this.positionXImages1024;
			this.cornerRoundedX = this.cornerRounded1024;
			this.cornerRoundedY = this.cornerRounded1024;
			this.paddingInnerResponsive = this.paddingInner1024;
			this.paddingOuterResponsive = this.paddingOuter1024;
			this.tickXPadding = 25;
		}
		if (this.windowSize === 'xl') {
			this.paddingLabel = 5;
			// this.maxBarWidth = 7.2;
			this.isMobile = false;
			this.paddingResponsive = this.paddingX01200;
			this.positionXAxisImagesResponsive = this.positionXImages1200;
			this.cornerRoundedX = this.cornerRounded1200;
			this.cornerRoundedY = this.cornerRounded1200;
			this.paddingInnerResponsive = this.paddingInner1200;
			this.paddingOuterResponsive = this.paddingOuter1200;
			this.tickXPadding = 25;
		}
	}

	// Window resize
	@HostListener('window:resize') onresize() {
		this.firstTimeReload = false;
		this.setWindowSize();
		this.getPaddingLabel();
		this.createGraphVertical();
	}

}
