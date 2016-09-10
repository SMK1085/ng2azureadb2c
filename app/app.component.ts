import {Component} from '@angular/core';

import {WelcomeComponent} from './home/welcome.component';


@Component({
    selector: 'ad2bc-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    pageTitle: 'Angular2 Azure AD B2C Sample';
}
