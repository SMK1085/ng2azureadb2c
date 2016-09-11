import {NgModule} from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginCallbackComponent } from './logincb.component';
import {routing} from './auth.routing';

@NgModule({
    imports: [routing],
    declarations: [LoginComponent, LoginCallbackComponent]
})
export class AuthModule { }
