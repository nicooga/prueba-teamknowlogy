export enum Reaction {
	LIKE = 'like',
	LOVE = 'love',
	HAHA = 'haha',
	WOW = 'wow',
	SAD = 'sad',
	ANGRY = 'angry'
}

export type PulseFacebookAffinityReactions = {
	[key in Reaction]: number;
};
