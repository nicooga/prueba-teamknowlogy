export interface PulseFacebookGeneralStatistics {
	pulse: {
		facebook: {
			common: {
				engagedUser: { date: string; value: number }[];
				engagementRate: { date: string; value: number }[];
				fans: { date: string; value: number }[];
				reach: { date: string; value: number }[];
			};
		};
	};
}
