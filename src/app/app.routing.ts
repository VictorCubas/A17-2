import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { RegistroComponent } from './pages/registro/registro.component';
import { PageModulesComponent } from './page-modules/page-modules.component';
// import { LoginComponent } from './login/login.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'comercio'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'comercio'},

    // Auth routes for guests
    {
        path: '',
        // canActivate: [NoAuthGuard],
        // canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            // {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            // {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
            //{path: 'seleccionar-comercio', loadChildren: () => import('app/modules/auth/select-comercio/select-comercio.module').then(m => m.SelectComercioModule)},
            // {path: 'sign-in', loadChildren: () => import('app/login/login.module').then(m => m.LoginModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            // {path: 'comercio', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
            {path: 'comercio', loadChildren: () => import('./modulos/comercio/comercio.module').then(m => m.ComercioModule)},
        ]
    },
    { path: 'registro', component: RegistroComponent },

    // {path: 'login', component: LoginComponent}, // inicio de sesion
    {path: 'modulos', component: PageModulesComponent}, // seleccion de modulo
    // {
    //   path: 'procesadora',
    //   component: NavigationComponent,
    //   loadChildren: () => import('./_module/procesadora/procesadora.module').then(m => m.ProcesadoraModule)
    // },
    // {
    //   path: 'entidad',
    //   component: NavigationComponent,
    //   loadChildren: () => import('./_module/entidad/entidad.module').then(m => m.EntidadModule)
    // },
    // {path: 'comercio', pathMatch : 'full', redirectTo: 'example'},


];
