import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { SessionService } from 'app/services/session.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit, OnDestroy
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    unsubscribe$: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private sessionSvc: SessionService,
    )
    {
        // this._router.navigate(['seleccionar-comercio']);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        const recordarme = localStorage.getItem('recordarme');
        console.log(recordarme);

        // Create the form
        this.signInForm = this._formBuilder.group({
            username     : [recordarme ?? '', [Validators.required]],
            password  : ['', Validators.required],
            rememberMe: [recordarme ? true : '']
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next({});
        this.unsubscribe$.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {

        // this._router.navigate(['seleccionar-comercio']);

        // return;

        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        if (this.signInForm.value.rememberMe) {
            localStorage.setItem('recordarme', this.signInForm.value.username);
        } else {
            localStorage.removeItem('recordarme');
        }

        this._authService.login(this.signInForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe( (resp: any) => {
            // console.log(resp);
            this._authService.setSession(resp);
            this.sessionSvc.setSession(resp);

           // if (resp.comercios.length > 1) {
                //this._router.navigateByUrl('seleccionar-comercio');
            //} else {
                // Navigate to the redirect url
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                this._router.navigateByUrl(redirectURL);
            //}

        }, () => {
            this.signInForm.enable();
        });

        // Sign in
        // this._authService.signIn(this.signInForm.value)
        //     .subscribe(
        //         () => {

        //             // Set the redirect url.
        //             // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        //             // to the correct page after a successful sign in. This way, that url can be set via
        //             // routing file and we don't have to touch here.
        //             const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        //             // Navigate to the redirect url
        //             this._router.navigateByUrl(redirectURL);

        //         },
        //         (response) => {

        //             // Re-enable the form
        //             this.signInForm.enable();

        //             // Reset the form
        //             this.signInNgForm.resetForm();

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Wrong email or password'
        //             };

        //             // Show the alert
        //             this.showAlert = true;
        //         }
        //     );
    }
}
