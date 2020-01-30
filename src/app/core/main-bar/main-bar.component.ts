import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'sq-main-bar',
	templateUrl: './main-bar.component.html',
	styleUrls: ['./main-bar.component.scss']
})
export class MainBarComponent implements OnInit {

	private keyUser = environment.secUser.usrUser;

	// Body
	public body = document.getElementsByTagName('body')[0];
	// Type
	public type = 'default';
	// Classes
	public clases = [];
	// Collapse
	public collapseMobileMenu = true;
	// Show mobile user menu
	public showUserMenuMobile = false;
	// Window size
	public windowSize = 'sm';
	public isMobile;
	// My glances

	public notifications = [];

	public toggleActive = false;
	@Input() basicMainBar = false;


	constructor(
		private router: Router
	) {
	}

	ngOnInit() {
	}

	// Toggle mobile menu
	public toggleMobileMenu() {
		this.showUserMenuMobile = false;
		this.collapseMobileMenu = !this.collapseMobileMenu;
	}
	// Toogle menu user mobile
	public toggleUserMenuMobile() {
		this.showUserMenuMobile = !this.showUserMenuMobile;
	}

	closeMenu() {
		this.collapseMobileMenu = true;
	}

	protected setWindowSize() {
		this.windowSize = 'sm';
		this.isMobile = true;

		if (window.innerWidth >= 1200) {
			this.windowSize = 'xl';
			this.isMobile = false;
		} else if (window.innerWidth >= 992) {
			this.windowSize = 'lg';
			this.isMobile = false;
		} else if (window.innerWidth >= 768) {
			this.windowSize = 'md';
			this.isMobile = false;
		} else if (window.innerWidth >= 576) {
			this.windowSize = 'sm';
			this.isMobile = true;
		}
	}

	@HostListener('window:resize') onResize() {
		this.setWindowSize();
		if (this.windowSize === 'xl' || this.windowSize === 'lg') {
			this.showUserMenuMobile = false;
			this.collapseMobileMenu = true;
		}
	}

}
