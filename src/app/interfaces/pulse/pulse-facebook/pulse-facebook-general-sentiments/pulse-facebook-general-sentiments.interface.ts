export interface PulseFacebookGeneralSentiments {
	pulse: {
		facebook: {
			common: {
				sentiment: { date: string; good: number; neutral: number; bad: number }[];
			};
		};
	};
}
