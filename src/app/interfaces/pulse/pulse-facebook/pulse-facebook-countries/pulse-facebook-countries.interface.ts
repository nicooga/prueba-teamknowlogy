export interface Cities {
	id: string;
	position: number;
	growth: 'down' | 'up';
	value: number;
	country: Country;
	name: string;
	lat: string;
	lng: string;
}

export interface Country {
	/** 'mex' */
	id: string;
	/** 'MEX' */
	iso_a3: string;
	/** 'MX' */
	iso_a2: string;
	alpha2: string;
	/** Posición para aparecer en el ranking */
	position: number;
	/** 'México' */
	name: string;
	/**  */
	growth: 'up' | 'down';
	value: number;
	cities: Cities[];
}
