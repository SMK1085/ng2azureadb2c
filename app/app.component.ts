import {Component} from '@angular/core';

import { AuthService } from './core/auth.service';

@Component({
    selector: 'ad2bc-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    pageTitle: 'Angular2 Azure AD B2C Sample';

    constructor(private authSvc: AuthService) { }

    onLogout() {
        this.authSvc.logout();
    }
}
