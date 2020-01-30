import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** COMPONENTS */
import { ComponentsComponent } from './components/components.component';

const routes: Routes = [
	{ path: '', component: ComponentsComponent},
	{path: '**', redirectTo: '', pathMatch: 'full'}
];

/**
 * Componente de principal de rutas
 * @export
 * @class AppRouting
 */
@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			// enableTracing: true
			// useHash: true
		})
	],
	exports: [RouterModule]
})
export class AppRouting {}
