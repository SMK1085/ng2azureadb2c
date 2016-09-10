import {NgModule} from '@angular/core';

import {WelcomeComponent} from './welcome.component';
import {routing} from './welcome.routing';

@NgModule({
    imports: [routing],
    declarations: [WelcomeComponent]
})
export class WelcomeModule { }
