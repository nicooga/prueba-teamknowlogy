import {
	Component, OnInit, ElementRef, Input, HostListener, ViewChild,
	OnDestroy, SimpleChanges, SimpleChange, OnChanges
} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { DecimalPipe, Location } from '@angular/common';
import * as momentImported from 'moment';
import { extendMoment } from 'moment-range';
import { NumberSuffixesSharedPipe } from 'src/app/pipes/number-suffixes-pipe/number-suffixes.pipe';

const moment = extendMoment(momentImported);

@Component({
	selector: 'sq-graph-bar-stacked-shared',
	templateUrl: './graph-bar-stacked.component.html',
	styleUrls: ['./graph-bar-stacked.component.scss']
})
export class GraphBarStackedSharedComponent implements OnInit, OnChanges, OnDestroy {

	public elementParent;
	public width;
	public height;
	public margin = { top: 20, bottom: 30 };
	public marginLeftResponsive;
	public marginRightResponsive;
	public windowSize;
	public isMobile;
	public elementGraph;
	public svg;
	public x;
	public y;
	public z;
	public dataReady = [];
	public xAxis;
	public yAxis;
	public suffixY;
	public tip;
	public cornerRoundedX;
	public cornerRoundedY;
	public totalPages = 0;
	public currentPage = 1;
	public dragOn = false;
	public dragFirstPoint;
	public tickPaddingXResponsive;
	public layers;

	@Input() filterApply = 'weekly';
	@Input() tickPaddingX1200 = 3;
	@Input() tickPaddingX1024 = 3;
	@Input() tickPaddingXTablet = 3;
	@Input() tickPaddingXMobile = 3;
	// @Input() tickPaddingX = 15;
	@Input() marginLeft1200 = 50;
	@Input() marginLeft1024 = 50;
	@Input() marginLeftTablet = 50;
	@Input() marginLeftMobile = 50;
	@Input() marginRight1200 = 10;
	@Input() marginRight1024 = 10;
	@Input() marginRightTablet = 10;
	@Input() marginRightMobile = 10;
	@Input() cornerRoundedMobile = 4;
	@Input() cornerRoundedTablet = 4;
	@Input() cornerRounded1024 = 4;
	@Input() cornerRounded1200 = 4;
	@Input() showLabelX = false;
	@Input() labelXText;
	@Input() id;
	@Input() paddingInner = 0.80;
	@Input() ticksAmount = 5;
	@Input() itemsPerPage = 8;
	@Input() paginateGraph = false;
	@Input() titleTooltip = 'Interacciones';
	@Input() formatAxisY = 'prefix';
	@Input() formatAxisX = '%a';
	@Input() colorHover = '#6254E3';
	@Input() colors = ['#00D0CE',
		'#885ACB',
		'#FF776C',
		'#6CA3E4'];
	@Input() keys = ['data1',
		'data2',
		'data3',
		'data4'];
	@Input() descriptionKeys = ['Data 1',
		'Data 2',
		'Data 3',
		'Data 4'];
		@Input() data = [
			{
			  date: '07/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 6766,
			  data4: 0,
			  total: 0
			},
			{
			  date: '08/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 5676,
			  data4: 0,
			  total: 0
			},
			{
			  date: '09/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 1212,
			  data4: 0,
			  total: 0
			},
			{
			  date: '10/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 7654,
			  data4: 0,
			  total: 0
			},
			{
			  date: '11/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 9876,
			  data4: 0,
			  total: 0
			},
			{
			  date: '12/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 6766,
			  data4: 0,
			  total: 0
			},
			{
			  date: '13/01/2019',
			  data1: 0,
			  data2: 0,
			  data3: 6766,
			  data4: 0,
			  total: 0
			}
		  ];

	@ViewChild('stackedGraphShared')
	private graphStacked: ElementRef;


	constructor(
		private elRef: ElementRef,
		private ns: NumberSuffixesSharedPipe,
		private dp: DecimalPipe,
		private location: Location
	) { }

	ngOnInit() {
		if (this.showLabelX) {
			this.margin.bottom = 60;
		}

		// this.colors = this.colors.reverse();
		// this.keys = this.keys.reverse();
		this.setWindowSize();
		this.getPaddingLabel();
		this.createTooltip();
		this.generateDummyData();
		this.drawGraph();
		this.currentPage = 1;
	}

	ngOnChanges(changes: SimpleChanges) {
		const data: SimpleChange = changes.data;
		const paginate: SimpleChange = changes.paginateGraph;
		const filterApply: SimpleChange = changes.filterApply;
		if ((data && !data.firstChange) || (paginate && !paginate.firstChange) || (filterApply && !filterApply.firstChange)) {
			this.setWindowSize();
			this.getPaddingLabel();
			this.generateDummyData();
			this.drawGraph();
			// if (this.isMobile) {
			//   this.createGraphResponsive();
			// } else {
			//   this.dragOn = false;
			// }
		}

	}

	ngOnDestroy() {
		if (this.tip) {
			this.tip.destroy();
		}
	}

	generateDummyData() {
		if (this.data.length === 0) {
			let startDate;
			let endDate;
			let rangeFormat;
			const now = moment();
			switch (this.filterApply) {
				case 'weekly':
					startDate = now.clone().weekday(0);
					endDate = now.clone().weekday(6);
					rangeFormat = 'days';
					break;
				case 'monthly':
					startDate = now.clone().startOf('month');
					endDate = now.clone().endOf('month');
					rangeFormat = 'days';
					break;
				case 'annual':
					startDate = now.clone().startOf('year');
					endDate = now.clone().endOf('year');
					rangeFormat = 'months';
					break;
				case 'historical':
					startDate = now.clone().subtract(7, 'years').startOf('year');
					endDate = now.clone().startOf('year');
					rangeFormat = 'years';
					break;
				default:
					startDate = now.clone().startOf('month');
					endDate = now.clone().endOf('month');
					rangeFormat = 'days';
					break;
			}

			const range = moment.range(moment(startDate), moment(endDate));

			Array.from(range.by(rangeFormat)).map((m: any) => {
				const formatGeneric = moment(m).format('DD/MM/YYYY');
				const value = { 'date': formatGeneric };
				this.keys.forEach(k => {
					value[k] = 0;
				});
				this.data.push(<any>value);
			});

		}
	}

	putLabels() {
		if (this.showLabelX) {
			// this.labelX = this.dataReady.nameRange;
			this.svg.append('text')
				.style('text-anchor', 'end')
				.style('stroke', 'none')
				.attr('class', 'squint-x-y-group-label')
				.text(this.labelXText)
				.attr('transform',
					'translate(' + (this.width) + ' ,' +
					(this.height + this.margin.top + 30) + ')');
		}
	}

	createGraphResponsive() {
		this.dragOn = true;
		// this.svg.append('rect')
		//   .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		//   .attr('class', 'overlay')
		//   .style('fill', 'none')
		//   .style('pointer-events', 'all')
		//   .attr('width', this.width)
		//   .attr('height', this.height)
		this.svg
			.call(
				d3.drag()
					.subject(function (d) { return { x: d3.event.x, y: d3.event.y }; })
					.on('start', this.dragstarted.bind(this))
					.on('end', this.dragended.bind(this))
			);
	}

	dragended(d) {
		let direction = '';
		const lastPoint = d3.event.x;
		if (this.dragFirstPoint !== lastPoint) {
			if (this.dragFirstPoint > lastPoint) {
				direction = 'right';
			} else {
				direction = 'left';
			}

		}

		if (direction === 'left') {
			this.currentPage--;
			if (this.currentPage <= 0) {
				this.currentPage = 1;
			}
		} else {
			this.currentPage++;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
		}

		this.drawGraph();

	}
	dragstarted(d) {
		this.dragFirstPoint = d3.event.x;

	}


	drawGraph() {
		this.colors.reverse();
		this.keys.reverse();
		this.elementGraph = this.graphStacked.nativeElement;
		this.elementParent = this.elRef.nativeElement.parentElement;


		d3.select(this.elementGraph).select('svg').remove();

		this.width = this.elementParent.offsetWidth - this.marginLeftResponsive - this.marginRightResponsive;
		this.height = this.elementParent.offsetHeight - this.margin.top - this.margin.bottom;

		this.svg = d3.select(this.elementGraph)
			.append('svg')
			.attr('width', this.width + this.marginLeftResponsive + this.marginRightResponsive)
			.attr('height', this.height + this.margin.top + this.margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + this.marginLeftResponsive + ',' + this.margin.top + ')');

		this.svg.call(this.tip);

		this.x = d3.scaleBand()
			.rangeRound([0, this.width])
			.paddingInner(this.paddingInner)
			.paddingOuter(0.50);

		this.y = d3.scaleLinear()
			.rangeRound([this.height, 0]);

		this.z = d3.scaleOrdinal()
			.range(this.colors);

		this.prepareData();

		this.svg.append('defs')
			.append('linearGradient')
			.attr('gradientUnits', 'userSpaceOnUse').attr('id', 'gradient-bar-stacked-' + this.id)
			.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', -this.y(0))
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

		// this.ticksAmount = 5;
		let maxY0 = d3.max(this.dataReady, (series) => series.total);
		if (maxY0 === 0 || maxY0 < 10) {
			maxY0 = 10;
		} else if (maxY0 > 10 && maxY0 < 100) {
			maxY0 = 100;
		}
		const tickStepY0 = maxY0 / this.ticksAmount;
		maxY0 = maxY0 + tickStepY0;
		const stepY0 = Math.ceil((tickStepY0 / this.ticksAmount) * this.ticksAmount);

		this.xAxis = d3.axisBottom(this.x).tickFormat(d3.timeFormat(this.formatAxisX)).tickPadding(this.tickPaddingXResponsive);
		this.yAxis = d3.axisLeft(this.y).ticks(stepY0).tickValues(d3.range(0, +maxY0 + stepY0, stepY0)).tickPadding(50);

		this.getFormatAxisY();

		const stack = d3.stack().keys(this.keys);

		this.layers = stack(this.dataReady).reverse();

		const parseDate = d3.timeParse('%d/%m/%Y');


		this.x.domain(this.dataReady.map((d: any) => parseDate(d.date)));
		this.y.domain([-(+maxY0 * .02), maxY0 + stepY0]);
		this.z.domain(this.keys);

		this.xAxis.tickSize(-this.height, 0, 0).tickSizeOuter(0);
		this.yAxis.tickSizeInner(-this.width)
			.tickSizeOuter(0);

		this.svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(this.xAxis)
			.selectAll('.tick line')
			.attr('id', (d, i) => `axisXline_${i}_${this.id}`)
			.style('stroke-width', (d) => this.width / this.dataReady.length + 'px')
			.style('stroke', `url(${this.location.path()}#gradient-bar-stacked-${this.id})`);

		const ticksY = this.svg.append('g')
			.attr('class', 'axis axis--y')
			.attr('transform', 'translate(0,0)')
			.call(this.yAxis);

		ticksY.selectAll('.tick text').style('text-anchor', 'start')
			.attr('y', '-4')
			.style('opacity', (d, i) => {
				if (i === 0) {
					return 0;
				} else {
					return 1;
				}
			});

		ticksY.selectAll('.tick line')
			// .style('stroke', (d, i) => {
			//   if (i === 0) {
			//     return '#636363';
			//   }
			// })
			// .style('stroke-dasharray', (d, i) => {
			//   if (i === 0) {
			//     return 'none';
			//   }
			// })
			.style('opacity', (d, i) => {
				if (i === 0) {
					return 0;
				}
			});

		const _this = this;

		this.svg.append('g')
			.selectAll('g')
			.data(this.layers)
			.enter().append('g')
			.attr('fill', (d: any, i) => {
				return this.z(d.key);
			})
			.selectAll('path')
			.data((d: any, i) => {
				return d;
			})
			.enter().append('path')
			.attr('d', d => `
        M${this.x(parseDate(d.data.date))},${(this.y(d[1])) + this.cornerRoundedY}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${-this.cornerRoundedY}
        h${this.x.bandwidth() - 2 * this.cornerRoundedX}
        a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${this.cornerRoundedY}
        v${this.height - this.y(d[1]) - this.cornerRoundedY}
        h${-(this.x.bandwidth())}Z
      `)
			// .attr('rx', this.cornerRoundedX)
			// .attr('ry', this.cornerRoundedY)
			// .attr('x', (d: any) => {
			//   return this.x(parseDate(d.data.date));
			// })
			// .attr('y', (d: any) => this.y(d[1]))
			// .attr('height', (d: any) => this.y(d[0]) - this.y(d[1]))
			// .attr('width', (d: any) => this.x.bandwidth())
			.on('mouseover', function (d, i) {
				_this.tip.show({ d, i }, document.querySelector(`#axisXline_${i}_${_this.id}`));
				d3.select(`#axisXline_${i}_${_this.id}`).style('opacity', 1);
			})
			.on('mouseout', function (d, i) {
				_this.tip.hide(document.querySelector(`#axisXline_${i}_${_this.id}`));
				d3.select(`#axisXline_${i}_${_this.id}`).style('opacity', 0);
			});

		// this.svg.append('g')
		//   .selectAll('g')
		//   .data(layers.reverse())
		//   .enter().append('g')
		//   .attr('fill', (d: any, i) => {
		//     return this.z(this.keys.length - (i + 1));
		//   })
		//   .selectAll('path')
		//   .data((d: any, i) => d)
		//   .enter().append('path')
		//     .attr('d', d => `
		//     M${this.x(parseDate(d.data.date))},${(this.y(d[1])) + this.cornerRoundedY}
		//     a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${-this.cornerRoundedY}
		//     h${this.x.bandwidth() - 2 * this.cornerRoundedX}
		//     a${this.cornerRoundedX},${this.cornerRoundedY} 0 0 1 ${this.cornerRoundedX},${this.cornerRoundedY}
		//     v${(this.y(d[0]) - this.y(d[1])) - this.y(d[1]) - this.cornerRoundedY}
		//     h${-(this.x.bandwidth())}Z
		//   `);
		// .attr('rx', this.cornerRoundedX)
		// .attr('ry', this.cornerRoundedY)
		// .attr('x', (d: any) => {
		//   return this.x(parseDate(d.data.date));
		// })
		// .attr('y', (d: any) => this.y(d[1]))
		// .attr('height', (d: any) => this.y(d[0]) - this.y(d[1]))
		// .attr('width', (d: any) => this.x.bandwidth());


		// .attr('rx', this.cornerRoundedX)
		// .attr('ry', this.cornerRoundedY)
		// .attr('x', (d: any) => {
		//   return this.x(parseDate(d.data.date));
		// })
		// .attr('y', (d: any) => this.y(d[1]))
		// .attr('height', (d: any) => this.y(d[0]) - this.y(d[1]))
		// .attr('width', (d: any) => this.x.bandwidth());

		this.putLabels();

	}

	createTooltip() {
		const _this = this;
		// const colors = this.colors.reverse();
		this.tip = d3Tip()
			.attr('class', 'pulse-graph-tooltip')
			.direction(function (d, i) {
				if (d.i >= Math.ceil(_this.data.length / 2)) {
					return 'w';
				} else {
					return 'e';
				}
			})
			.offset(function (d, i) {
				if (d.i >= Math.ceil(_this.data.length / 2)) {
					return [-15, -15];
				} else {
					return [-15, 15];
				}
			})
			.html((d: any) => {
				let html =
					'<div class="header-tooltip">' + this.titleTooltip + '</div>' +

					'<div class="body-tooltip">';


				this.keys.forEach((element, i) => {
					html += `<div class="item-tooltip">
                       <div class="title-item">
                         <div class="circle" style="background-color: ${this.colors[i]}"></div>
                         ${this.dp.transform(d.d.data[this.keys[i]])}
                       </div>
                    </div>`;
				});

				html += '</div>';

				return html;
			});
	}

	getFormatAxisY() {
		switch (this.formatAxisY) {
			case 'currency':
				this.yAxis.tickFormat((d) =>
					'$ ' + this.ns.transform(d, this.suffixY)
				);
				break;
			case 'percentage':
				this.yAxis.tickFormat(d3.format('.0%'));
				break;
			case 'prefix':
				this.yAxis.tickFormat((d) => this.ns.transform(d, this.suffixY));
				break;
		}
	}

	getPpalFormatY() {
		const aux = this.ns.transform(d3.max(this.dataReady, (series) => series.total)).split(' ').pop();
		this.suffixY = aux;
	}

	prepareData() {
		this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
		this.dataReady = this.data;
		if (this.isMobile || this.paginateGraph) {
			if (this.currentPage === 1) {
				this.dataReady = this.data.slice(0, this.currentPage * this.itemsPerPage);
			} else {

				let rangeFormat;
				switch (this.filterApply) {
					case 'weekly':
						rangeFormat = 'days';
						break;
					case 'monthly':
						rangeFormat = 'days';
						break;
					case 'annual':
						rangeFormat = 'months';
						break;
					case 'historical':
						rangeFormat = 'years';
						break;
					default:
						rangeFormat = 'days';
						break;
				}
				this.dataReady = this.data.slice(((this.currentPage - 1) * this.itemsPerPage), this.currentPage * this.itemsPerPage);
				if (this.currentPage === this.totalPages) {
					if (this.dataReady.length < 7) {
						const dif = 7 - +this.dataReady.length;
						const end = moment(this.dataReady[this.dataReady.length - 1].date)
							.clone().add(dif, rangeFormat).format('DD/MM/YYYY');
						const start = moment(this.dataReady[this.dataReady.length - 1].date)
							.clone().add(1, rangeFormat).format('DD/MM/YYYY');
						const range = moment.range(moment(start), moment(end));

						Array.from(range.by(rangeFormat)).forEach((m: any) => {
							const formatGeneric = moment(m).format('DD/MM/YYYY');
							const value = { 'date': formatGeneric };
							this.keys.forEach(k => {
								value[k] = 0;
							});
							this.dataReady.push(<any>value);
						});
					}
				}

				// }

			}
		}
		this.dataReady.forEach((d, i) => {
			let sumaAux = 0;
			for (let c = 0; c < this.keys.length; c++) {
				sumaAux += d[this.keys[c]];
			}
			d.total = sumaAux;
		});
		this.getPpalFormatY();
	}

	scrollNext() {
		this.currentPage++;
		if (this.currentPage > this.totalPages) {
			this.currentPage = this.totalPages;
		}

		this.drawGraph();
	}

	scrollBack() {
		this.currentPage--;
		if (this.currentPage <= 0) {
			this.currentPage = 1;
		}

		this.drawGraph();
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
			this.isMobile = true;
			this.marginLeftResponsive = this.marginLeftMobile;
			this.marginRightResponsive = this.marginRightMobile;
			this.cornerRoundedX = this.cornerRoundedMobile;
			this.cornerRoundedY = this.cornerRoundedMobile;
			this.tickPaddingXResponsive = this.tickPaddingXMobile;
		}
		if (this.windowSize === 'md') {
			this.isMobile = false;
			this.marginLeftResponsive = this.marginLeftTablet;
			this.marginRightResponsive = this.marginRightTablet;
			this.cornerRoundedX = this.cornerRoundedTablet;
			this.cornerRoundedY = this.cornerRoundedTablet;
			this.tickPaddingXResponsive = this.tickPaddingXTablet;

		}
		if (this.windowSize === 'lg') {
			this.isMobile = false;
			this.marginLeftResponsive = this.marginLeft1024;
			this.marginRightResponsive = this.marginRight1024;
			this.cornerRoundedX = this.cornerRounded1024;
			this.cornerRoundedY = this.cornerRounded1024;
			this.tickPaddingXResponsive = this.tickPaddingX1024;

		}
		if (this.windowSize === 'xl') {
			this.isMobile = false;
			this.marginLeftResponsive = this.marginLeft1200;
			this.marginRightResponsive = this.marginRight1200;
			this.cornerRoundedX = this.cornerRounded1200;
			this.cornerRoundedY = this.cornerRounded1200;
			this.tickPaddingXResponsive = this.tickPaddingX1200;

		}

	}

	// Window resize
	@HostListener('window:resize') onresize() {
		this.setWindowSize();
		this.getPaddingLabel();
		this.drawGraph();
		// if (this.isMobile) {
		//   this.createGraphResponsive();
		// } else {
		//   this.dragOn = false;
		// }
	}

}
