export type Ages = '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '+65';

export type GenerationKey = 'x' | 'y' | 'z' | 'baby' | 'silent';

export interface Generation {
	key: GenerationKey;
	title: string;
	imageMale: string;
	imageFemale: string;
	qualify: string;
}

export interface PulseFacebookCommunityAges {
	unknown: {
		rank: Ages;
		value: number;
	}[];
	male: {
		rank: Ages;
		value: number;
	}[];
	female: {
		rank: Ages;
		value: number;
	}[];
}
