import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';

export class AuthServiceConfig {
    domainName: string;
    clientId: string; // application id
    responseType: string; // id_token or code+id_token
    redirectUri: string;
    responseMode: string; // form_post or fragment
    scope: string; // openid or optional openid%20offline_access 
    policy: string; // the name of the policy, something like "b2c_1_"
    prompt: string = 'login'; // the type of user interaction, at the moment only login is allowed
}

@Injectable()
export class AuthService {
    private _config: AuthServiceConfig;
    private _lsKey: string = 'id_token';
    private _loggedIn: boolean = false;

    constructor(private _router: Router, @Optional() config: AuthServiceConfig) {
        if (config) {
            // Use the provided config
            this._config = config;
        }

        this._loggedIn = !!localStorage.getItem(this._lsKey);
    }

    public showLogin(state?: string) {
        let nonce: string = Date.now().toString();
        localStorage.setItem('oidc_nonce', nonce);
        let url: string = 'https://login.microsoftonline.com/' + this._config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + this._config.clientId +
            '&response_type=' + this._config.responseType +
            '&redirect_uri=' + encodeURIComponent(this._config.redirectUri) +
            '&response_mode=' + this._config.responseMode +
            '&scope=' + this._config.scope +
            '&state=' + encodeURIComponent(state ? state : Date.now().toString()) +
            '&nonce=' + nonce +
            '&p=' + this._config.policy;

        window.location.assign(url);
    }

    public login(hash: string) {
        // TODO: handle JWT token and other information obtained from Azure AD B2C
        let hashEntries: string[] = hash.split('&');
        let adResponse: any = {};
        let jwtHelper: JwtHelper = new JwtHelper();
        let nonceExpected: string = localStorage.getItem('oidc_nonce');
        let token: any;

        hashEntries.forEach(element => {
            adResponse[element.split('=')[0]] = element.split('=')[1];
        });

        token = jwtHelper.decodeToken(adResponse.id_token);
        if (token.nonce !== nonceExpected) {
            console.log({
                message: 'Nonce is not equal, assume token replay attack',
                clnt: nonceExpected,
                srv: token.nonce
            });
            return;
        }

        if (token.aud !== this._config.clientId) {
            console.log('Audience does not match application id');
            return;
        }

        let date = new Date(0);
        date.setUTCSeconds(token.exp);
        if (date < new Date()) {
            console.log('Token expired at ' + date.toISOString());
            return;
        }

        // Consider token is valid
        localStorage.setItem(this._lsKey, token);
        this._loggedIn = true;

        this._router.navigate(['/welcome']);
    }


    public logout() {
        localStorage.removeItem(this._lsKey);
        localStorage.removeItem('oidc_nonce');
        let url: string = 'https://login.microsoftonline.com/' + this._config.domainName +
            '/oauth2/v2.0/logout?p=' + this._config.policy +
            '&post_logout_redirect_uri=' + encodeURIComponent('http://azure.microsoft.com');
        window.location.assign(url);
    }

    public isAuthenticated() {
        return this._loggedIn;
    }
}


class JwtHelper {
    public urlBase64Decode(str: string): string {

        let output = str.replace(/-/g, '+').replace(/_/g, '/');

        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return decodeURIComponent(encodeURI(typeof window === 'undefined' ? atob(output) : window.atob(output)));
    }

    public decodeToken(token: string): any {

        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        let decoded = this.urlBase64Decode(parts[1]);

        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);

    }

};
