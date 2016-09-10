import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';

@Component({
    templateUrl: 'app/home/welcome.component.html'
})
export class WelcomeComponent implements AfterViewInit {
    public pageTitle: string = 'Welcome';
    private _authSvc: AuthService;

    constructor(private _router: Router) {
        this._authSvc = new AuthService(this._router, null);
     }

    ngAfterViewInit() {
        if (!this._authSvc.isAuthenticated()) {
            this._router.navigate(['/auth/login']);
        }
    }
}
