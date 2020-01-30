import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import * as uuidv4 from 'uuid/v4';
const uuid = uuidv4;
@Component({
	selector: 'sq-ranking-table-shared',
	templateUrl: './ranking-table.component.html',
	styleUrls: ['./ranking-table.component.scss']
})
export class RankingTableSharedComponent implements OnInit {
	// Public vars
	public _selectedRow: any = { id: null };
	public rows: any = { id: null };
	public defaultPaginationConfig: PaginationInstance = {
		id: uuid(),
		itemsPerPage: 5,
		currentPage: 1,
		totalItems: 0
	};
	// Inputs
	@Input() activeRow = true;
	@Input() classname = '';
	@Input() title = 'Squint rank';
	@Input() paginationLabel = 'países';
	@Input() paginationConfig: PaginationInstance;
	@Input() currencyEnd;
	@Input() currencyStart;
	@Input() set data(data: any) {
		this.rows = data;
		setTimeout(() => {
			// Page
			this.defaultPaginationConfig.currentPage = 1;
			// Total items
			this.defaultPaginationConfig.totalItems = this.rows.length;
		});

	}
	@Input() set selectedRow(row: any) {
		this._selectedRow = row;
	}
	// Outpus
	@Output() rankingOnSelectRow = new EventEmitter();
	@Output() rankingOnChangePage = new EventEmitter();
	// Contructor
	constructor() { }
	// Init
	ngOnInit() {
		Object.assign(this.defaultPaginationConfig, this.paginationConfig);
	}
	// Select row
	public selectRow(row): void {
		// Change
		this.rankingOnSelectRow.emit(row);
		// Set current
		this._selectedRow = row;
	}
	// Set page
	setPage(page) {
		setTimeout(() => {
			this.defaultPaginationConfig.currentPage = page;
			this.rankingOnChangePage.emit(page);
		});
	}
}
