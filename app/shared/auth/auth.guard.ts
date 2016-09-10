import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _authSvc: AuthService) { }

    canActivate(){
        return this._authSvc.isAuthenticated();
    }
}
