import { DateValue } from 'src/app/interfaces/date-value/date-value.interface';

export interface PulseFacebookInvestmentCommon {
	investment: DateValue[];
	engagedUser: DateValue[];
	reach: DateValue[];
	impressionsTotal: DateValue[];
}

export interface PulseFacebookInvestmentReturn {
	campaignFrequency: DateValue[];
	campaignReach: DateValue[];
	relevanceScore: DateValue[];
	campaignCtr: DateValue[];
}

export interface PulseFacebookInvestment {
	common: PulseFacebookInvestmentCommon;
	investmentReturn: PulseFacebookInvestmentReturn;
}
