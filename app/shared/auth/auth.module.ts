import {NgModule} from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginCallbackComponent } from './logincb.component';
import { LogoutComponent } from './logout.component';
import {routing} from './auth.routing';

@NgModule({
    imports: [routing],
    declarations: [LoginComponent, LoginCallbackComponent, LogoutComponent]
})
export class AuthModule { }
