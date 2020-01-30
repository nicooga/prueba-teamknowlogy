// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	envName: 'prod',
	production: true,
	urlBase: 'api',
	tokenKey: 'sq_token',
	userKey: 'sq_user',
	urlApiGraph: 'https://graph.squintboard.com/',
	urlApiRest: 'https://backoffice.squintboard.com',
	urlApiSearch: 'http://localhost:4200/gcs',
	squintAppKey: '$2y$12$779JNOqJHqw84rLQ5PWk5OEmNpoJ86DOtYe1WaO.RJI94rPft3wru',
	firebaseConfig: {
		apiKey: 'AIzaSyDv66YH2eK6ZJuW8a1qslf9-1gfWfl9xA0',
		authDomain: 'squint-design.firebaseapp.com',
		databaseURL: 'https://squint-design.firebaseio.com',
		projectId: 'squint-design',
		storageBucket: '',
		messagingSenderId: '512016091465',
		appId: '1:512016091465:web:9407c99319cb7832'
	},
	// Socials oauth
	instagram: {
		clientID: '29076ad455694a89a5d63d69530a3a5b',
		clientSecret: '08e1017caf804c91ba11bd466df4ccdc'
	},
	facebook: {
		appId: '747672342355413',
		appSecret: 'e7229b5684f3fb7f9f3e7b5093ae0f00',
		version: 'v4.0'
	},
	youtube: {
		apiKey: 'AIzaSyBQm6NGs700UgBWKu7GZ3U1f0_VmZNwqkI',
		scopes: [
			'profile',
			'email',
			'https://www.googleapis.com/auth/yt-analytics.readonly',
			'https://www.googleapis.com/auth/youtube',
			'https://www.googleapis.com/auth/youtube.force-ssl',
			'https://www.googleapis.com/auth/youtube.readonly',
			'https://www.googleapis.com/auth/youtubepartner',
			'https://www.googleapis.com/auth/youtubepartner-channel-audit'
		]
	},
	googleCustomSearch: {
		apiKey: 'AIzaSyB4vT7dLeJPf1vJc8-en5xto6MFdm4vL_M',
		facebookCX: '017996534112655587268:m-wkyhdiyhk',
		instagramCX: '017996534112655587268:zasypdj95o0',
		youTubeCX: '017996534112655587268:b-54ie7bris',
		appsCx: '017996534112655587268:bv94f8fcdrw',
		appStoreCX: '017996534112655587268:bv94f8fcdrw',
		googlePlayCX: '017996534112655587268:4beux76cxpm'
	},
	twitter: {
		consumer_key: 'Ajs6dTcWceBm8RnMrS5ZwCMHk',
		consumer_secret: 'fy5XkUF0Vu61zV4GZAtIbB9yCG5r0hwMu3gDMCDdAlA1UlI1GQ',
		access_token_key: '1108435067028664322-SMPJDHK5gt1GftSm2RgTi2LCUK57uF',
		access_token_secret: 'Elw9N3Wlb1OdNBth5rgHkyNtYlOIZuPYa2XswWRLeei66',
		apiUrl: 'http://localhost:4200/social-auth/twitter'
	},
	google: {
		apiUrl: 'http://localhost:4200/social-auth/google'
	},
	apps: {
		apiUrl: 'http://localhost:4200/social-auth/apps'
	},
	squintFacebook: {
		apiUrl: 'http://localhost:4200/api-facebook',
		username: 'lenin.meza@teamknowlogy.com',
		password: 'password'
	},
	secUser: {
		usrToken : 'tokenNew',
		usrUser : 'usrUser',
		usrStatus: 'usrStatus',
		respUpdUser : 'respUpdUser',
		respUpdPass : 'respUpdPass',
		urlLogin : 'http://52.91.157.101:8090/loginUser',
		urlLogout : 'http://52.91.157.101:8090/logoutUser',
		urlRecoverPass : 'http://52.91.157.101:8090/recoverPass',
		urlUpdatePassword : 'http://52.91.157.101:8090/updatePassword',
		urlUpdateUser : 'http://52.91.157.101:8090/editUser'
	}
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
