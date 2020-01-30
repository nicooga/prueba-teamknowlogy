import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/** THIRD PARTY MODULES */
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFittextModule } from 'angular-fittext';
import { OwlModule } from 'ngx-owl-carousel';
/** CORE */
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { MainBarComponent } from './main-bar/main-bar.component';
import { AvatarComponent } from './avatar/avatar.component';
import { PanelSearchItemComponent } from './panel-search-item/panel-search-item.component';
import { SecondaryMenuComponent } from './secondary-menu/secondary-menu.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../shared/shared.module';


/**
 * Módulo de CORE de la aplicación
 * @export
 * @class CoreModule
 */
@NgModule({
	declarations: [
		FooterComponent,
		HeaderComponent,
		SearchComponent,
		AvatarComponent,
		PanelSearchItemComponent,
		MainBarComponent,
		SecondaryMenuComponent

	],
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		AngularFittextModule,
		OwlModule,
		SwiperModule,
		NgbTooltipModule,
		MatSidenavModule,
		SharedModule
		// GlancesMenuModule
	],
	exports: [
		FooterComponent,
		HeaderComponent,
		SearchComponent,
		AvatarComponent,
		PanelSearchItemComponent,
		MainBarComponent,
		SecondaryMenuComponent
	]
})
export class CoreModule { }
