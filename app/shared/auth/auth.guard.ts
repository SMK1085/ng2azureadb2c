import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authSvc: AuthService) { }

    canActivate() {
        return this.authSvc.isAuthenticated();
    }
}
