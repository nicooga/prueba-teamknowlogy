export interface CommunitySourceOption {
	index: string;
	text: string;
	percentage: number;
	number: number;
	color: string;
}

export interface PulseFacebookCommunitySources {
	externalSources: {
		name: string;
		value: number;
	}[];
	internalSources: {
		name: string;
		value: number;
	}[];
}
