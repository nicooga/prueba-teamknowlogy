import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpBackend, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
/** APP */
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { CoreModule } from './core/core.module';
/** SHARED */
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SearchUserPipe } from './pipes/search-user.pipe';
import { SearchUserBrandPipe } from './pipes/search-user-brand.pipe';
import { SearchBrandPipe } from './pipes/search-brand.pipe';
import { ComponentsComponent } from './components/components.component';

/** COMPONENTS */

/**
 * Componente Módulo principal
 * @export
 * @class AppModule
 */
@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule,
		AppRouting,
		SharedModule,
		CoreModule,
    BrowserAnimationsModule,
    MatSidenavModule,
	],
  declarations: [AppComponent, ComponentsComponent, SearchUserPipe, SearchUserBrandPipe, SearchBrandPipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
  ) {
  }
}
