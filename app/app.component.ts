import {Component} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, AuthServiceConfig } from './core/auth.service';

@Component({
    selector: 'ad2bc-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    private _authSvc: AuthService;
    pageTitle: 'Angular2 Azure AD B2C Sample';

    constructor(private _router: Router) {
        let config: AuthServiceConfig = new AuthServiceConfig();
        config.domainName = '<YOUR_AD_DOMAIN>';
        config.policy = '<YOUR_POLICY>';

        this._authSvc = new AuthService(this._router, config);
    }

    onLogout() {
        this._authSvc.logout();
    }
}
