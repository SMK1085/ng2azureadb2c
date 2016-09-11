import {
    NgModule,
    Optional, SkipSelf }     from '@angular/core';

import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { JsonpModule }       from '@angular/http';

import { TitleComponent }    from './title.component';
import { AuthService, AuthServiceConfigService }       from './auth.service';

@NgModule({
    imports: [CommonModule, RouterModule, JsonpModule],
    declarations: [TitleComponent],
    exports: [TitleComponent],
    providers: [AuthService, AuthServiceConfigService]
})
export class CoreModule {

    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

}
