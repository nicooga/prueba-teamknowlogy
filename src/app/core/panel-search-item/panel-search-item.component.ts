import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'sq-panel-search-item',
	templateUrl: './panel-search-item.component.html',
	styleUrls: ['./panel-search-item.component.scss']
})
export class PanelSearchItemComponent implements OnInit, OnChanges {

	@Input() title = '';
	@Input() showPanel = false;
	@Input() showBack = false;
	@Input() classTitle = '';
	@Input() noTitle = false;

	@Output() closePanelEvent: EventEmitter<any> = new EventEmitter();
	@Output() backEvent: EventEmitter<any> = new EventEmitter();

	public lightLogo;


	constructor(
	) {
	}

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		const showPanel = changes.showPanel;

		if (showPanel && showPanel.currentValue) {
			document.body.style.overflowY = 'hidden';
			document.body.style.overflowX = 'hidden';
		} else {
			document.body.style.overflowY = null;
			document.body.style.overflowX = null;
		}
	}

	closePanel() {
		this.closePanelEvent.emit(null);
		document.body.style.overflowY = null;
		document.body.style.overflowX = null;
	}

}
