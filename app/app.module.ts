import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthService } from './core/auth.service';

@NgModule({
    imports: [BrowserModule, routing],
    declarations: [AppComponent],
    providers:[AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }
