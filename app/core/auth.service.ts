import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response, Jsonp, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Rx';

export class AuthUser {
    constructor(public displayName: string, public email: string) { }
}

interface IAuthServiceConfigLocalStorageKeys {
    idToken: string;
    nonce: string;
    token: string;
}

export class AuthServiceConfigLocalStorageKeys {
    idToken: string;
    nonce: string;
    token: string;
}

export class AuthServiceConfig {
    domainName: string;
    clientId: string;
    responseType: string;
    redirectUri: string;
    responseMode: string;
    scope: string;
    policy: string;
    prompt: string;
    localStorageKeys: IAuthServiceConfigLocalStorageKeys;

}

@Injectable()
export class AuthServiceConfigService {

    private filePath = 'app/config/azureadb2c.json';

    constructor(private http: Http) { }

    load(): Observable<AuthServiceConfig> {
        return this.http.get(this.filePath + '?v=' + new Date().toISOString())
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        let lsKeys = new AuthServiceConfigLocalStorageKeys();
        lsKeys.idToken = body.localStorageKeys.idToken;
        lsKeys.nonce = body.localStorageKeys.nonce;
        lsKeys.token = body.localStorageKeys.token;
        let data: AuthServiceConfig = body as AuthServiceConfig;
        if (data) {
            data.localStorageKeys = lsKeys;
        }
        // if (body) {
        //     data.clientId = body.clientId;
        //     data.domainName = body.domainName;
        //     data.localStorageKeys = new AuthServiceConfigLocalStorageKeys();
        //     data.localStorageKeys.idToken = body.localStorageKeys.idToken;
        //     data.localStorageKeys.nonce = body.localStorageKeys.nonce;
        //     data.localStorageKeys.token = body.localStorageKeys.token;
        //     data.policy = body.policy;
        //     data.prompt = body.prompt;
        //     data.redirectUri = body.redirectUri;
        //     data.responseMode = body.responseMode;
        //     data.responseType = body.responseType;
        //     data.scope = body.scope;
        // }
        return data;
    }

    private handleError(error: any) {
        console.log(error);
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` :
                'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}

@Injectable()
export class AuthService {
    private config: AuthServiceConfig;
    private loggedIn: boolean = false;
    private jwtUtil: JwtHelper;

    constructor(private router: Router,
        private configSvc: AuthServiceConfigService,
        private http: Http,
        private jsonp: Jsonp) {
        this.jwtUtil = new JwtHelper();
    }

    public showLogin(state?: string, policy?: string) {
        console.log('Show Login called.');
        if (this.config) {
            this.redirectToLogin(state, policy);
        } else {
            // Load config first and perform redirect to auth server
            this.configSvc.load()
                .subscribe((c: AuthServiceConfig) => {
                    this.config = c;
                    this.redirectToLogin(state, policy);
                }, (e: any) => {
                    console.log(e);
                });
        }
    }

    public login(hash: string, policy?: string) {
        let hashEntries: string[] = hash.split('&');
        let adResponse: any = {};

        hashEntries.forEach(element => {
            adResponse[element.split('=')[0]] = element.split('=')[1];
        });

        if (this.config) {
            this.validateToken(adResponse, policy);
        } else {
            this.configSvc.load()
                .subscribe((c: AuthServiceConfig) => {
                    this.config = c;
                    this.validateToken(adResponse, policy);
                }, (e: any) => {
                    console.log(e);
                });
        }
    }

    public logout(policy?: string) {
        if (this.config) {
            this.redirectToLogout(policy);
        } else {
            this.configSvc.load()
                .do((c: AuthServiceConfig) => {
                    this.config = c;
                    this.redirectToLogout(policy);
                }, (e: any) => {
                    console.log(e);
                });
        }
    }

    public isAuthenticated() {
        return this.loggedIn;
    }

    public getUser(): AuthUser {
        if (this.loggedIn) {
            let tokenInfo = this.jwtUtil.decodeToken(localStorage.getItem(this.config.localStorageKeys.idToken));
            return new AuthUser(tokenInfo.emails[0], tokenInfo.name);
        } else {
            return null;
        }
    }

    private redirectToLogin(state?: string, policy?: string) {
        console.log('Local Storage Keys:');
        console.log(this.config.localStorageKeys);
        let nonce: string = Date.now().toString();
        localStorage.setItem(this.config.localStorageKeys.nonce, nonce);
        let st: string = state ? state : Date.now().toString();
        let p: string = policy ? policy : this.config.policy;

        let url: string = 'https://login.microsoftonline.com/' + this.config.domainName +
            '/oauth2/v2.0/authorize?client_id=' + this.config.clientId +
            '&response_type=' + this.config.responseType +
            '&redirect_uri=' + encodeURIComponent(this.config.redirectUri) +
            '&response_mode=' + this.config.responseMode +
            '&scope=' + this.config.scope +
            '&state=' + encodeURIComponent(st) +
            '&nonce=' + nonce +
            '&p=' + p;
        console.log('Redirecting to ' + url);
        window.location.assign(url);
    }

    private redirectToLogout(policy?: string) {
        localStorage.removeItem(this.config.localStorageKeys.idToken);
        localStorage.removeItem(this.config.localStorageKeys.nonce);
        let url: string = 'https://login.microsoftonline.com/' + this.config.domainName +
            '/oauth2/v2.0/logout?p=' + (policy) ? policy : this.config.policy +
            'post_logout_redirect_uri=' + encodeURIComponent('http://azure.microsoft.com');
        window.location.assign(url);
    }
    private validateToken(res: any, policy?: string) {
        // Implements the required steps described in the OIDC reference
        // https://github.com/Azure/azure-content/blob/master/articles/active-directory-b2c/active-directory-b2c-reference-oidc.md
        let p = policy ? policy : this.config.policy;
        let idToken = this.jwtUtil.decodeToken(res.id_token);
        // let idTokenHeader = this.jwtUtil.decodeTokenHeader(res.id_token);
        let nonceExpected: string = localStorage.getItem(this.config.localStorageKeys.nonce);

        this.loadTokenSigningKeys(p)
            .subscribe((keys: TokenSigningKey[]) => {
                // 1. Validate the signature
                // Search for an open source library
                // console.log(this.jwtUtil.getSignature(res.id_token));
                // console.log(idToken);

                // 2. Validate the claims
                if (idToken.nonce !== nonceExpected) {
                    console.log({
                        message: 'Nonce is not equal, assume token replay attack',
                        clnt: nonceExpected,
                        srv: idToken.nonce
                    });
                    return;
                }


                if (idToken.aud !== this.config.clientId) {
                    console.log('Audience does not match application id');
                    return;
                }

                let date = new Date(0);
                date.setUTCSeconds(idToken.exp);
                if (date < new Date()) {
                    console.log('Token expired at ' + date.toISOString());
                    return;
                }

                // 3. Store the token and log in the user
                localStorage.setItem(this.config.localStorageKeys.idToken, idToken);
                this.loggedIn = true;

                this.router.navigate(['/welcome']);

            }, (e: any) => {
                console.log(e);
            });
    }

    private loadTokenSigningKeys(policy: string): Observable<TokenSigningKey[]> {
        // Azure AD B2C OpenID Connect metadata endpoint for the keys
        // Downloading the content from the MS server is a CORS request,
        // this request is blocked by the browser.
        // Download the json and save it in a file under api/adb2c/<policy>.json instead. 
        // let url: string = 'https://login.microsoftonline.com/' + this.config.domainName +
        //     '/discovery/v2.0/keys?p=' + policy;
        let url: string = 'api/adb2c/' + policy + '.json';
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(url, options)
                    .map(this.extractTokenSigningKeys)
                    .catch(this.handleErrorTokenSigningKeys);
    }

    private extractTokenSigningKeys(res: Response) {
        let body = res.json();
        console.log(body);
        return body.keys ? body.keys : [] as TokenSigningKey[];
    }

    private handleErrorTokenSigningKeys(error: any) {
        console.log('error when retrieving data');
        console.log(error);
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` :
                'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}

class TokenSigningKey {
    public kid: string;
    public use: string;
    public kty: string;
    public e: string;
    public n: string;

}

class JwtHelper {
    public urlBase64Decode(str: string): string {

        let output = str.replace(/-/g, '+').replace(/_/g, '/');

        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
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

    public decodeTokenHeader(token: string): any {
        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        let decoded = this.urlBase64Decode(parts[0]);

        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);

    }

    public getSignature(token: string): any {
        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        return parts[2];
    }

};
