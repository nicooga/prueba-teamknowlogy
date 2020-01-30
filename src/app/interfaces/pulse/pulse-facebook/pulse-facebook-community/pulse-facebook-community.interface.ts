export interface PulseFacebookCommunity {
	common: {
		fans: {
			date: string;
			value: number;
		}[];
		investment: {
			date: string;
			value: number;
		}[];
		engagedUser: {
			date: string;
			value: number;
		}[];
		reach: {
			date: string;
			value: number;
		}[];
		impressionsTotal: {
			date: string;
			value: number;
		}[];
		impressionsPaid: {
			date: string;
			value: number;
		}[];
		impressionsOrganic: {
			date: string;
			value: number;
		}[];
		impressionsViral: {
			date: string;
			value: number;
		}[];
		engagementRate: {
			date: string;
			value: number;
		}[];
		engagementTotal: {
			date: string;
			value: number;
		}[];
		engagementPaid: {
			date: string;
			value: number;
		}[];
		engagementOrganic: {
			date: string;
			value: number;
		}[];
		engagementViral: {
			date: string;
			value: number;
		}[];
	};
	community: {
		organicFans: {
			date: string;
			value: number;
		}[];
		paidFans: {
			date: string;
			value: number;
		}[];
		viralFans: {
			date: string;
			value: number;
		}[];
	};
}
