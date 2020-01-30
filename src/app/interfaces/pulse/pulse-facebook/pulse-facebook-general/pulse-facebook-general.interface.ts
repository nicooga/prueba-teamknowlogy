export interface PulseFacebookGeneral {
	pulse: {
		facebook: {
			nick: string;
			title: string;
			general: {
				affinity: {
					kind: string;
					value: number;
				};
				cover: {
					kind: string;
					value: string;
				};
				logo: {
					kind: string;
					value: string;
				};
				squintRank: {
					kind: string;
					value: number;
				};
			};
		};
	};
}
