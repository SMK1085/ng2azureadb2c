import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';

@Component({
    templateUrl: 'app/home/welcome.component.html'
})
export class WelcomeComponent implements AfterViewInit {
    public pageTitle: string = 'Welcome';

    constructor(private authSvc: AuthService,
                private router: Router) { }

    ngAfterViewInit() {
        if (!this.authSvc.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
        }
    }
}
