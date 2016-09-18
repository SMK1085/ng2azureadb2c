import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';

@Component({
    template: '<div>Redirecting...</div>'
})
export class LogoutComponent implements OnInit {

    constructor(private authSvc: AuthService) { }

    ngOnInit() {

        this.authSvc.showLogoff();

    }

}
