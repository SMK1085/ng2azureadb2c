import {NgModule} from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginCallbackComponent } from './logincb.component';
import { AuthGuard } from './auth.guard';
import {routing} from './auth.routing';

@NgModule({
    imports: [routing],
    declarations: [LoginComponent, LoginCallbackComponent]
})
export class AuthModule { }
