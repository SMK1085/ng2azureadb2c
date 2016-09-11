import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';

@Component({
    template: '<div>Logging in...</div>'
})
export class LoginCallbackComponent implements OnInit {

    constructor(private authSvc: AuthService) { }

    ngOnInit () {
        let hash: string = window.location.hash.substr(1);
        this.authSvc.login(hash);
    }
}
