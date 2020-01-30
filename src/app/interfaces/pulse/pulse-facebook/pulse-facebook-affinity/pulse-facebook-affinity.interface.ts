import { DateValue } from 'src/app/interfaces/date-value/date-value.interface';

export interface PulseFacebookAffinity {
	common: {
		engagementRate: DateValue[];
		engagedUser: DateValue[];
		comments: DateValue[];
	};
	affinity: {
		postPerformanceRatio: DateValue[];
		stories: DateValue[];
		reactionsCount: DateValue[];
		shares: DateValue[];
		clicks: DateValue[];
	};
}
