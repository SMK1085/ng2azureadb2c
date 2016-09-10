import { ModuleWithProviders } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginCallbackComponent } from './logincb.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'adcb',
        component: LoginCallbackComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
