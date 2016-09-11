import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthService } from './core/auth.service';
import { CoreModule }     from './core/core.module';

@NgModule({
    imports: [BrowserModule, HttpModule, CoreModule, routing],
    declarations: [AppComponent],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }
