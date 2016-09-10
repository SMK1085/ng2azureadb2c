import {Component} from 'angular2/core';

import {WelcomeComponent} from './home/welcome.component';

import { ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'ad2bc-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    styleUrls: ['app/app.component.css']
})
@RouteConfig([
    { path: '/welcome', name: 'Welcome', component: WelcomeComponent, useAsDefault: true }
])
export class AppComponent {
    pageTitle: 'Angular2 Azure AD B2C Sample';
}
