import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
	name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {
	constructor(private sanitized: DomSanitizer) { }
	transform(value: any, context: string): any {
		let sanitize;

		if (context === 'html') {
			sanitize = this.sanitized.bypassSecurityTrustHtml(value);
		}
		if (context === 'url') {
			sanitize = this.sanitized.bypassSecurityTrustUrl(value);
		}
		if (context === 'resource') {
			sanitize = this.sanitized.bypassSecurityTrustResourceUrl(value);
		}
		if (context === 'script') {
			sanitize = this.sanitized.bypassSecurityTrustScript(value);
		}
		if (context === 'style') {
			sanitize = this.sanitized.bypassSecurityTrustStyle(value);
		}


		return sanitize;
	}

}
