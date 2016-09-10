import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadChildren: 'app/home/welcome.module#WelcomeModule'
    },
    {
        path: 'auth',
        loadChildren: 'app/shared/auth/auth.module#AuthModule'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

