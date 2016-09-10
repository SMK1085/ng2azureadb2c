import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, AuthServiceConfig } from '../../core/auth.service';

@Component({
    template: '<div>Logging in...</div>'
})
export class LoginCallbackComponent implements OnInit {
    private _authSvc: AuthService;

    constructor(private _router: Router) {
        let config: AuthServiceConfig = new AuthServiceConfig();
        config.clientId = 'dddcf0c1-847e-4c32-b409-d9d81c4e86aa';
        config.domainName = 'wmitb2cgermany.onmicrosoft.com';
        config.policy = 'B2C_1_ng2azureadb2c_susi';
        config.redirectUri = 'http://localhost:42901/auth/adcb';
        config.responseMode = 'fragment';
        config.responseType = 'code+id_token';
        config.scope = 'openid%20offline_access';

        this._authSvc = new AuthService(this._router, config);
    }

    ngOnInit () {
        let hash: string = window.location.hash.substr(1);
        this._authSvc.login(hash);
    }
}
