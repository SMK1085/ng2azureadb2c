import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';

@Component({
    template: '<div>Redirecting...</div>'
})
export class LoginComponent implements OnInit {

    constructor(private authSvc: AuthService) { }

    ngOnInit() {
        if (!this.authSvc.isAuthenticated()) {
            this.authSvc.showLogin();
        }
    }

}
