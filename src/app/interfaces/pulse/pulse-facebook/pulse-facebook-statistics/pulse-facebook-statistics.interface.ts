/**
 * Interface PulseFbStatistics
 * @export
 * @interface PulseFbStatistics
 */
export interface PulseFbStatistics {
	cardTitle: string;
	dataArray: {
		/** "30/10/2019" */
		date: string;
		dateFormat: Date;
		highestPoint: boolean;
		impressions: number;
		nameRange: string;
		tooltipData: number;
		value: number;
	};
	key: string;
	nameRange: string;
	selected: boolean;
	statistics: {
		percentage: number;
		/** "+12.77% vs Last Week" */
		subtitle: string;
		symbol: '+' | '-' | '=';
		title: number;
		type: 'UP' | 'DOWN' | 'EQUALS';
	};
}
