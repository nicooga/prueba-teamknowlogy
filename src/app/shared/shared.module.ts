import { NgModule } from '@angular/core';
/** SHARED */
import { CommonModule, CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CardSharedComponent } from './card/card.component';
import { NumberSuffixesSharedPipe } from '../pipes/number-suffixes-pipe/number-suffixes.pipe';
import { MomentDateSharedPipe } from '../pipes/moment-date-pipe/moment-date.pipe';
import { PaginationSharedComponent } from './pagination/pagination.component';
import { RankingTableSharedComponent } from './ranking-table/ranking-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NiceDateFormatTimestampSharedPipe } from '../pipes/nice-date-format-timestamp-pipe/nice-date-format-timestamp.pipe';
import { ChartWorldMapSharedComponent } from './chart-world-map/chart-world-map.component';
import { GraphBarStackedSharedComponent } from './graph-bar-stacked/graph-bar-stacked.component';
import { FormsModule } from '@angular/forms';
import { GraphVerticalIndividualSharedComponent } from './graph-vertical-individual/graph-vertical-individual.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SanitizePipe } from '../pipes/sanitize-pipe/sanitize.pipe';
import { PaymentMethodPipe } from '../pipes/payment-method-pipe/payment-method.pipe';

/**
 * Contenedor modular de componentes compartidos
 * @export
 * @class SharedModule
 */
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		// CoreModule,
		NgbCollapseModule,
		NgbDropdownModule,
		NgbTooltipModule,
		NgxPaginationModule,
		NgbCollapseModule,
		InlineSVGModule.forRoot()
	],
	declarations: [
		CardSharedComponent,
		NumberSuffixesSharedPipe,
		MomentDateSharedPipe,
		PaginationSharedComponent,
		RankingTableSharedComponent,
		NiceDateFormatTimestampSharedPipe,
		ChartWorldMapSharedComponent,
		GraphBarStackedSharedComponent,
		GraphVerticalIndividualSharedComponent,
		PaymentMethodPipe,
	],
	exports: [
		CardSharedComponent,
		NumberSuffixesSharedPipe,
		MomentDateSharedPipe,
		PaginationSharedComponent,
		RankingTableSharedComponent,
		NiceDateFormatTimestampSharedPipe,
		ChartWorldMapSharedComponent,
		GraphBarStackedSharedComponent,
		GraphVerticalIndividualSharedComponent,
		PaymentMethodPipe
		],
	providers: [
		NumberSuffixesSharedPipe,
		CurrencyPipe,
		DecimalPipe,
		PercentPipe,
		MomentDateSharedPipe,
		NiceDateFormatTimestampSharedPipe,
		SanitizePipe
	]
})
export class SharedModule { }
