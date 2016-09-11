import { Component, Input, OnInit } from '@angular/core';
import { AuthService, AuthUser } from './auth.service';

@Component({
    selector: 'app-title',
    templateUrl: 'app/core/title.component.html'
})
export class TitleComponent implements OnInit {
    @Input() siteTitle: string = '';
    appTitle: string = 'Ng2 Sample';
    isAuthenticated: boolean = false;
    userInfo: AuthUser;

    constructor(private authSvc: AuthService) {

    }

    ngOnInit() {
        this.isAuthenticated = this.authSvc.isAuthenticated();
        if (this.isAuthenticated) {
            let usr: AuthUser = this.authSvc.getUser();
            this.userInfo = usr;
        } else {
            this.userInfo = new AuthUser('', '');
        }
    }
}
