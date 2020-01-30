import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';

@Component({
	selector: 'sq-pagination-shared',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationSharedComponent implements OnInit, OnChanges {

	public itemsTotalPerPage = 0;


	@Input()
	config: PaginationInstance;

	@Input() pluralText = 'Elements';

	@Input() singularText = 'Element';

	@Input() type = 1;

	@Input() customFunctions = false;

	@Input() totalItemsCustom = 0;

	@Input() pageCustom = 1;

	@Input() totalPagesCustom;

	@Input() extraClass = '';

	@Output() changePage = new EventEmitter();


	constructor() { }

	ngOnInit() {
		if (this.type === 2) {
			if (this.customFunctions) {
				this.getItemsTotalPerPage(this.totalItemsCustom, this.pageCustom);
			} else {
				this.getItemsTotalPerPage();
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		const page: SimpleChange = changes.pageCustom;
		const totalItemsCustom: SimpleChange = changes.totalItemsCustom;


		if ((totalItemsCustom && !totalItemsCustom.firstChange)) {
			this.totalItemsCustom = totalItemsCustom.currentValue;
			this.getItemsTotalPerPage();
		}
		if (page && !page.firstChange) {
			this.getItemsTotalPerPage(this.totalItemsCustom, page.currentValue);
		}
	}

	getPage(event, totalItems) {
		if (!this.customFunctions) {
			this.config.currentPage = event;
			if (this.type === 2) {
				this.getItemsTotalPerPage(totalItems);
			}
		}
	}

	getItemsTotalPerPage(totalItems?: number, page?: number) {
		if (totalItems) {
			if (this.customFunctions) {
				this.itemsTotalPerPage = this.config.itemsPerPage * page;
			} else {
				this.itemsTotalPerPage = this.config.itemsPerPage * this.config.currentPage;
			}
			if (this.itemsTotalPerPage > totalItems) {
				this.itemsTotalPerPage = totalItems;
			}
		} else {
			if (this.totalItemsCustom !== null) {

				this.itemsTotalPerPage = this.totalItemsCustom < this.config.itemsPerPage ? this.totalItemsCustom : this.config.itemsPerPage;
			} else {
				this.itemsTotalPerPage = this.config.totalItems < this.config.itemsPerPage ? this.config.totalItems : this.config.itemsPerPage;

			}
		}
	}

	clickChangePage(type) {
		this.changePage.emit(type);
	}

}
