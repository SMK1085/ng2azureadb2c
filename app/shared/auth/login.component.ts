import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, AuthServiceConfig } from '../../core/auth.service';

@Component({
    template: '<div>Redirecting...</div>'
})
export class LoginComponent implements OnInit {
    private _authSvc: AuthService;

    constructor(private _router: Router) {
        let config: AuthServiceConfig = new AuthServiceConfig();
        config.clientId = '<YOUR_APP_ID>';
        config.domainName = '<YOUR_AD_DOMAIN>';
        config.policy = '<YOUR_POLICY>';
        config.redirectUri = 'http://localhost:42901/auth/adcb';
        config.responseMode = 'fragment';
        config.responseType = 'code+id_token';
        config.scope = 'openid%20offline_access';

        this._authSvc = new AuthService(this._router, config);
    }

    ngOnInit() {
        if (!this._authSvc.isAuthenticated()) {
            this._authSvc.showLogin();
        }
    }

}