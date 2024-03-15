import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { SessionService } from 'app/services/session.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { ComercioService } from 'app/modulos/comercio/administrar-comercio/comercio.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {

    isScreenSmall: boolean;
    navigation: Navigation;
    user: any;
    unreadCount: number = 0;
    imgLogo = null;

    comercios = [];

    comercioActual = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private sessionSvc: SessionService,
        private _notificationsService: NotificationsService,
        private comercioSvc: ComercioService,
        private authSvc: AuthService,
    ) {

        console.log(this.comercioActual);

        this._notificationsService.cantidadSinLeer.pipe(takeUntil(this._unsubscribeAll)).subscribe( (e: number) => {
            this.unreadCount = e;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    /**
     * Cambia el comercio del usuario
     *
     * @param e elementos del listado de comercio
     */
    cambiarComercio(e: any): void {

        if (e.value) {
            console.log(e.value);
            this.authSvc.login({ comercioId: e.value.id}).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp: any) => {
                this._router.navigate(['comercio']);
                localStorage.setItem('comercio', JSON.stringify(e.value));
                this.sessionSvc.setSession(resp);
                this.comercioActual = e.value;
            });
        } else {
            this.comercioActual = this.comercioActual;
            this._router.navigate(['comercio/usuario/registrar']);
        }

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.comercioSvc.updateComercioSelector.pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp: boolean) => {

            if (resp) {
                this.comercioSvc.getComerciosFromServer().pipe(takeUntil(this._unsubscribeAll)).subscribe( (respData: any) => {
                    this.comercios = respData.comercios;
                });
            }

        });

        this.comercios = this.sessionSvc.getComercios();

        const comercioStorage = localStorage.getItem('comercio');
        console.log(comercioStorage);
        if (comercioStorage) {
            const comercioStorageObj = JSON.parse(comercioStorage);
            const index = this.comercios.findIndex( e => e.id === comercioStorageObj.id);

            this.comercioActual = this.comercios[index];

        } else {
            this.comercioActual = this.comercios[0];
        }

        console.log(this.sessionSvc.getMenuList());

        const menu = this.sessionSvc.getMenuList();

        this.navigation = menu ?? {
            default: [],
            futuristic: [],
            horizontal: [],
            compact: [],
        };

        // Subscribe to navigation data
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         console.log('se recupera');
        //         console.log(navigation);
        //         this.navigation = navigation;
        //     });

        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                console.log(user);
                this.user = user;
                // this.user.avatar = user.avatar;
                console.log(this.sessionSvc.getNombreUsuario());
                this.user.name = this.sessionSvc.getNombreUsuario();
                this.user.email = this.sessionSvc.getDocumentoUsuario();
                this.user.avatar = 'assets/images/avatars/market-png-logo.png';
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Cambia la foto de perfil del comercio
     *
     * @param e evento de carga de imagen
     */
    async subirArchivo(e: any): Promise<void> {
        const files = e.srcElement.files;


        if (files) {
            try {
                if (files[0].type.includes('image')) {
                    // await this.blobToBase64(files[0]).then((data: any) => data);
                    this.comercioActual.logo = await this.blobToBase64(files[0]).then( data => data);
                }
                this._userService.updateSidebarLogo(files[0]).pipe(takeUntil(this._unsubscribeAll)).subscribe( () => {

                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    blobToBase64(blob: Blob): any {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = (): any => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    getMenu(): Navigation {
        return {
            compact: [],
            default: [
                {
                    id: 'dashboards',
                    title: 'Dashboards',
                    subtitle: 'Unique dashboard designs',
                    type: 'group',
                    icon: 'mat_outline:home',
                    children: [
                        {
                            id: 'dashboards.project',
                            title: 'Project',
                            type: 'basic',
                            icon: 'mat_outline:clipboard-check',
                            link: '/dashboards/project',
                        },
                        {
                            id: 'dashboards.analytics',
                            title: 'Analytics',
                            type: 'basic',
                            icon: 'mat_outline:chart-pie',
                            link: '/dashboards/analytics',
                        },
                        {
                            id: 'dashboards.finance',
                            title: 'Finance',
                            type: 'basic',
                            icon: 'mat_outline:cash',
                            link: '/dashboards/finance',
                        },
                        {
                            id: 'dashboards.crypto',
                            title: 'Crypto',
                            type: 'basic',
                            icon: 'mat_outline:currency-dollar',
                            link: '/dashboards/crypto',
                        },
                    ],
                },
                {
                    id: 'apps',
                    title: 'Applications',
                    subtitle: 'Custom made application designs',
                    type: 'group',
                    icon: 'mat_outline:home',
                    children: [
                        {
                            id: 'apps.academy',
                            title: 'Academy',
                            type: 'basic',
                            icon: 'mat_outline:academic-cap',
                            link: '/apps/academy',
                        },
                        {
                            id: 'apps.chat',
                            title: 'Chat',
                            type: 'basic',
                            icon: 'mat_outline:chat-alt',
                            link: '/apps/chat',
                        },
                        {
                            id: 'apps.contacts',
                            title: 'Contacts',
                            type: 'basic',
                            icon: 'mat_outline:user-group',
                            link: '/apps/contacts',
                        },
                        {
                            id: 'apps.ecommerce',
                            title: 'ECommerce',
                            type: 'collapsable',
                            icon: 'mat_outline:shopping-cart',
                            children: [
                                {
                                    id: 'apps.ecommerce.inventory',
                                    title: 'Inventory',
                                    type: 'basic',
                                    link: '/apps/ecommerce/inventory',
                                },
                            ],
                        },
                        {
                            id: 'apps.file-manager',
                            title: 'File Manager',
                            type: 'basic',
                            icon: 'mat_outline:cloud',
                            link: '/apps/file-manager',
                        },
                        {
                            id: 'apps.help-center',
                            title: 'Help Center',
                            type: 'collapsable',
                            icon: 'mat_outline:support',
                            link: '/apps/help-center',
                            children: [
                                {
                                    id: 'apps.help-center.home',
                                    title: 'Home',
                                    type: 'basic',
                                    link: '/apps/help-center',
                                    exactMatch: true,
                                },
                                {
                                    id: 'apps.help-center.faqs',
                                    title: 'FAQs',
                                    type: 'basic',
                                    link: '/apps/help-center/faqs',
                                },
                                {
                                    id: 'apps.help-center.guides',
                                    title: 'Guides',
                                    type: 'basic',
                                    link: '/apps/help-center/guides',
                                },
                                {
                                    id: 'apps.help-center.support',
                                    title: 'Support',
                                    type: 'basic',
                                    link: '/apps/help-center/support',
                                },
                            ],
                        },
                        {
                            id: 'apps.mailbox',
                            title: 'Mailbox',
                            type: 'basic',
                            icon: 'mat_outline:mail',
                            link: '/apps/mailbox',
                            badge: {
                                title: '27',
                                classes:
                                    'px-2 bg-pink-600 text-white rounded-full',
                            },
                        },
                        {
                            id: 'apps.notes',
                            title: 'Notes',
                            type: 'basic',
                            icon: 'mat_outline:pencil-alt',
                            link: '/apps/notes',
                        },
                        {
                            id: 'apps.scrumboard',
                            title: 'Scrumboard',
                            type: 'basic',
                            icon: 'mat_outline:view-boards',
                            link: '/apps/scrumboard',
                        },
                        {
                            id: 'apps.tasks',
                            title: 'Tasks',
                            type: 'basic',
                            icon: 'mat_outline:check-circle',
                            link: '/apps/tasks',
                        },
                    ],
                },
                {
                    id: 'pages',
                    title: 'Pages',
                    subtitle: 'Custom made page designs',
                    type: 'group',
                    icon: 'mat_outline:document',
                    children: [
                        {
                            id: 'pages.activities',
                            title: 'Activities',
                            type: 'basic',
                            icon: 'mat_outline:menu-alt-2',
                            link: '/pages/activities',
                        },
                        {
                            id: 'pages.authentication',
                            title: 'Authentication',
                            type: 'collapsable',
                            icon: 'mat_outline:lock-closed',
                            children: [
                                {
                                    id: 'pages.authentication.sign-in',
                                    title: 'Sign in',
                                    type: 'collapsable',
                                    children: [
                                        {
                                            id: 'pages.authentication.sign-in.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/classic',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/modern',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-in.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-in/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.sign-up',
                                    title: 'Sign up',
                                    type: 'collapsable',
                                    link: '/pages/authentication/sign-up',
                                    children: [
                                        {
                                            id: 'pages.authentication.sign-up.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/classic',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/modern',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-up.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-up/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.sign-out',
                                    title: 'Sign out',
                                    type: 'collapsable',
                                    link: '/pages/authentication/sign-out',
                                    children: [
                                        {
                                            id: 'pages.authentication.sign-out.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/classic',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/modern',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.sign-out.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/sign-out/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.forgot-password',
                                    title: 'Forgot password',
                                    type: 'collapsable',
                                    link: '/pages/authentication/forgot-password',
                                    children: [
                                        {
                                            id: 'pages.authentication.forgot-password.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/classic',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/modern',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.forgot-password.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/forgot-password/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.reset-password',
                                    title: 'Reset password',
                                    type: 'collapsable',
                                    link: '/pages/authentication/reset-password',
                                    children: [
                                        {
                                            id: 'pages.authentication.reset-password.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/classic',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/modern',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.reset-password.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/reset-password/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.unlock-session',
                                    title: 'Unlock session',
                                    type: 'collapsable',
                                    link: '/pages/authentication/unlock-session',
                                    children: [
                                        {
                                            id: 'pages.authentication.unlock-session.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/classic',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/modern',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.unlock-session.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/unlock-session/fullscreen-reversed',
                                        },
                                    ],
                                },
                                {
                                    id: 'pages.authentication.confirmation-required',
                                    title: 'Confirmation required',
                                    type: 'collapsable',
                                    link: '/pages/authentication/confirmation-required',
                                    children: [
                                        {
                                            id: 'pages.authentication.confirmation-required.classic',
                                            title: 'Classic',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/classic',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/modern',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.modern-reversed',
                                            title: 'Modern Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/modern-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.split-screen',
                                            title: 'Split Screen',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/split-screen',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.split-screen-reversed',
                                            title: 'Split Screen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/split-screen-reversed',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.fullscreen',
                                            title: 'Fullscreen',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/fullscreen',
                                        },
                                        {
                                            id: 'pages.authentication.confirmation-required.fullscreen-reversed',
                                            title: 'Fullscreen Reversed',
                                            type: 'basic',
                                            link: '/pages/authentication/confirmation-required/fullscreen-reversed',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'pages.coming-soon',
                            title: 'Coming Soon',
                            type: 'collapsable',
                            icon: 'mat_outline:clock',
                            link: '/pages/coming-soon',
                            children: [
                                {
                                    id: 'pages.coming-soon.classic',
                                    title: 'Classic',
                                    type: 'basic',
                                    link: '/pages/coming-soon/classic',
                                },
                                {
                                    id: 'pages.coming-soon.modern',
                                    title: 'Modern',
                                    type: 'basic',
                                    link: '/pages/coming-soon/modern',
                                },
                                {
                                    id: 'pages.coming-soon.modern-reversed',
                                    title: 'Modern Reversed',
                                    type: 'basic',
                                    link: '/pages/coming-soon/modern-reversed',
                                },
                                {
                                    id: 'pages.coming-soon.split-screen',
                                    title: 'Split Screen',
                                    type: 'basic',
                                    link: '/pages/coming-soon/split-screen',
                                },
                                {
                                    id: 'pages.coming-soon.split-screen-reversed',
                                    title: 'Split Screen Reversed',
                                    type: 'basic',
                                    link: '/pages/coming-soon/split-screen-reversed',
                                },
                                {
                                    id: 'pages.coming-soon.fullscreen',
                                    title: 'Fullscreen',
                                    type: 'basic',
                                    link: '/pages/coming-soon/fullscreen',
                                },
                                {
                                    id: 'pages.coming-soon.fullscreen-reversed',
                                    title: 'Fullscreen Reversed',
                                    type: 'basic',
                                    link: '/pages/coming-soon/fullscreen-reversed',
                                },
                            ],
                        },
                        {
                            id: 'pages.error',
                            title: 'Error',
                            type: 'collapsable',
                            icon: 'mat_outline:exclamation-circle',
                            children: [
                                {
                                    id: 'pages.error.404',
                                    title: '404',
                                    type: 'basic',
                                    link: '/pages/error/404',
                                },
                                {
                                    id: 'pages.error.500',
                                    title: '500',
                                    type: 'basic',
                                    link: '/pages/error/500',
                                },
                            ],
                        },
                        {
                            id: 'pages.invoice',
                            title: 'Invoice',
                            type: 'collapsable',
                            icon: 'mat_outline:calculator',
                            children: [
                                {
                                    id: 'pages.invoice.printable',
                                    title: 'Printable',
                                    type: 'collapsable',
                                    children: [
                                        {
                                            id: 'pages.invoice.printable.compact',
                                            title: 'Compact',
                                            type: 'basic',
                                            link: '/pages/invoice/printable/compact',
                                        },
                                        {
                                            id: 'pages.invoice.printable.modern',
                                            title: 'Modern',
                                            type: 'basic',
                                            link: '/pages/invoice/printable/modern',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'pages.maintenance',
                            title: 'Maintenance',
                            type: 'basic',
                            icon: 'mat_outline:exclamation',
                            link: '/pages/maintenance',
                        },
                        {
                            id: 'pages.pricing',
                            title: 'Pricing',
                            type: 'collapsable',
                            icon: 'mat_outline:cash',
                            children: [
                                {
                                    id: 'pages.pricing.modern',
                                    title: 'Modern',
                                    type: 'basic',
                                    link: '/pages/pricing/modern',
                                },
                                {
                                    id: 'pages.pricing.simple',
                                    title: 'Simple',
                                    type: 'basic',
                                    link: '/pages/pricing/simple',
                                },
                                {
                                    id: 'pages.pricing.single',
                                    title: 'Single',
                                    type: 'basic',
                                    link: '/pages/pricing/single',
                                },
                                {
                                    id: 'pages.pricing.table',
                                    title: 'Table',
                                    type: 'basic',
                                    link: '/pages/pricing/table',
                                },
                            ],
                        },
                        {
                            id: 'pages.profile',
                            title: 'Profile',
                            type: 'basic',
                            icon: 'mat_outline:account_circle',
                            link: '/pages/profile',
                        },
                        {
                            id: 'pages.settings',
                            title: 'Settings',
                            type: 'basic',
                            icon: 'mat_outline:engineering',
                            link: '/pages/settings',
                        },
                    ],
                },
                {
                    id: 'user-interface',
                    title: 'User Interface',
                    subtitle: 'Building blocks of the UI & UX',
                    type: 'group',
                    icon: 'mat_outline:collection',
                    children: [
                        {
                            id: 'user-interface.material-components',
                            title: 'Material Components',
                            type: 'basic',
                            icon: 'mat_outline:chip',
                            link: '/ui/material-components',
                        },
                        {
                            id: 'user-interface.fuse-components',
                            title: 'Fuse Components',
                            type: 'basic',
                            icon: 'mat_outline:chip',
                            link: '/ui/fuse-components',
                        },
                        {
                            id: 'user-interface.other-components',
                            title: 'Other Components',
                            type: 'basic',
                            icon: 'mat_outline:chip',
                            link: '/ui/other-components',
                        },
                        {
                            id: 'user-interface.tailwindcss',
                            title: 'TailwindCSS',
                            type: 'basic',
                            icon: 'mat_outline:sparkles',
                            link: '/ui/tailwindcss',
                        },
                        {
                            id: 'user-interface.advanced-search',
                            title: 'Advanced Search',
                            type: 'basic',
                            icon: 'mat_outline:search-circle',
                            link: '/ui/advanced-search',
                        },
                        {
                            id: 'user-interface.animations',
                            title: 'Animations',
                            type: 'basic',
                            icon: 'mat_outline:play',
                            link: '/ui/animations',
                        },
                        {
                            id: 'user-interface.cards',
                            title: 'Cards',
                            type: 'basic',
                            icon: 'mat_outline:duplicate',
                            link: '/ui/cards',
                        },
                        {
                            id: 'user-interface.colors',
                            title: 'Colors',
                            type: 'basic',
                            icon: 'mat_outline:color-swatch',
                            link: '/ui/colors',
                        },
                        {
                            id: 'user-interface.confirmation-dialog',
                            title: 'Confirmation Dialog',
                            type: 'basic',
                            icon: 'mat_outline:question-mark-circle',
                            link: '/ui/confirmation-dialog',
                        },
                        {
                            id: 'user-interface.datatable',
                            title: 'Datatable',
                            type: 'basic',
                            icon: 'mat_outline:view-list',
                            link: '/ui/datatable',
                        },
                        {
                            id: 'user-interface.forms',
                            title: 'Forms',
                            type: 'collapsable',
                            icon: 'mat_outline:pencil-alt',
                            children: [
                                {
                                    id: 'user-interface.forms.fields',
                                    title: 'Fields',
                                    type: 'basic',
                                    link: '/ui/forms/fields',
                                },
                                {
                                    id: 'user-interface.forms.layouts',
                                    title: 'Layouts',
                                    type: 'basic',
                                    link: '/ui/forms/layouts',
                                },
                                {
                                    id: 'user-interface.forms.wizards',
                                    title: 'Wizards',
                                    type: 'basic',
                                    link: '/ui/forms/wizards',
                                },
                            ],
                        },
                        {
                            id: 'user-interface.icons',
                            title: 'Icons',
                            type: 'collapsable',
                            icon: 'mat_outline:lightning-bolt',
                            children: [
                                {
                                    id: 'user-interface.icons.heroicons-outline',
                                    title: 'Heroicons Outline',
                                    type: 'basic',
                                    link: '/ui/icons/heroicons-outline',
                                },
                                {
                                    id: 'user-interface.icons.heroicons-solid',
                                    title: 'Heroicons Solid',
                                    type: 'basic',
                                    link: '/ui/icons/heroicons-solid',
                                },
                                {
                                    id: 'user-interface.icons.material-twotone',
                                    title: 'Material Twotone',
                                    type: 'basic',
                                    link: '/ui/icons/material-twotone',
                                },
                                {
                                    id: 'user-interface.icons.material-outline',
                                    title: 'Material Outline',
                                    type: 'basic',
                                    link: '/ui/icons/material-outline',
                                },
                                {
                                    id: 'user-interface.icons.material-solid',
                                    title: 'Material Solid',
                                    type: 'basic',
                                    link: '/ui/icons/material-solid',
                                },
                                {
                                    id: 'user-interface.icons.iconsmind',
                                    title: 'Iconsmind',
                                    type: 'basic',
                                    link: '/ui/icons/iconsmind',
                                },
                                {
                                    id: 'user-interface.icons.feather',
                                    title: 'Feather',
                                    type: 'basic',
                                    link: '/ui/icons/feather',
                                },
                            ],
                        },
                        {
                            id: 'user-interface.page-layouts',
                            title: 'Page Layouts',
                            type: 'collapsable',
                            icon: 'mat_outline:template',
                            children: [
                                {
                                    id: 'user-interface.page-layouts.overview',
                                    title: 'Overview',
                                    type: 'basic',
                                    link: '/ui/page-layouts/overview',
                                },
                                {
                                    id: 'user-interface.page-layouts.empty',
                                    title: 'Empty',
                                    type: 'basic',
                                    link: '/ui/page-layouts/empty',
                                },
                                {
                                    id: 'user-interface.page-layouts.carded',
                                    title: 'Carded',
                                    type: 'collapsable',
                                    children: [
                                        {
                                            id: 'user-interface.page-layouts.carded.fullwidth',
                                            title: 'Fullwidth',
                                            type: 'basic',
                                            link: '/ui/page-layouts/carded/fullwidth',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.carded.left-sidebar-1',
                                            title: 'Left Sidebar #1',
                                            type: 'basic',
                                            link: '/ui/page-layouts/carded/left-sidebar-1',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.carded.left-sidebar-2',
                                            title: 'Left Sidebar #2',
                                            type: 'basic',
                                            link: '/ui/page-layouts/carded/left-sidebar-2',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.carded.right-sidebar-1',
                                            title: 'Right Sidebar #1',
                                            type: 'basic',
                                            link: '/ui/page-layouts/carded/right-sidebar-1',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.carded.right-sidebar-2',
                                            title: 'Right Sidebar #2',
                                            type: 'basic',
                                            link: '/ui/page-layouts/carded/right-sidebar-2',
                                        },
                                    ],
                                },
                                {
                                    id: 'user-interface.page-layouts.simple',
                                    title: 'Simple',
                                    type: 'collapsable',
                                    children: [
                                        {
                                            id: 'user-interface.page-layouts.simple.fullwidth-1',
                                            title: 'Fullwidth #1',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/fullwidth-1',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.fullwidth-2',
                                            title: 'Fullwidth #2',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/fullwidth-2',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.left-sidebar-1',
                                            title: 'Left Sidebar #1',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/left-sidebar-1',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.left-sidebar-2',
                                            title: 'Left Sidebar #2',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/left-sidebar-2',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.left-sidebar-3',
                                            title: 'Left Sidebar #3',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/left-sidebar-3',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.right-sidebar-1',
                                            title: 'Right Sidebar #1',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/right-sidebar-1',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.right-sidebar-2',
                                            title: 'Right Sidebar #2',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/right-sidebar-2',
                                        },
                                        {
                                            id: 'user-interface.page-layouts.simple.right-sidebar-3',
                                            title: 'Right Sidebar #3',
                                            type: 'basic',
                                            link: '/ui/page-layouts/simple/right-sidebar-3',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'user-interface.typography',
                            title: 'Typography',
                            type: 'basic',
                            icon: 'mat_outline:pencil',
                            link: '/ui/typography',
                        },
                    ],
                },
                {
                    id: 'divider-1',
                    type: 'divider',
                },
                {
                    id: 'documentation',
                    title: 'Documentation',
                    subtitle: 'Everything you need to know about Fuse',
                    type: 'group',
                    icon: 'mat_outline:support',
                    children: [
                        {
                            id: 'documentation.changelog',
                            title: 'Changelog',
                            type: 'basic',
                            icon: 'mat_outline:speakerphone',
                            link: '/docs/changelog',
                            badge: {
                                title: '14.2.0',
                                classes:
                                    'px-2 bg-yellow-300 text-black rounded-full',
                            },
                        },
                        {
                            id: 'documentation.guides',
                            title: 'Guides',
                            type: 'basic',
                            icon: 'mat_outline:book-open',
                            link: '/docs/guides',
                        },
                    ],
                },
                {
                    id: 'divider-2',
                    type: 'divider',
                },
                {
                    id: 'navigation-features',
                    title: 'Navigation features',
                    subtitle: 'Collapsable levels & badge styles',
                    type: 'group',
                    icon: 'mat_outline:menu',
                    children: [
                        {
                            id: 'navigation-features.level.0',
                            title: 'Level 0',
                            icon: 'mat_outline:check-circle',
                            type: 'collapsable',
                            children: [
                                {
                                    id: 'navigation-features.level.0.1',
                                    title: 'Level 1',
                                    type: 'collapsable',
                                    children: [
                                        {
                                            id: 'navigation-features.level.0.1.2',
                                            title: 'Level 2',
                                            type: 'collapsable',
                                            children: [
                                                {
                                                    id: 'navigation-features.level.0.1.2.3',
                                                    title: 'Level 3',
                                                    type: 'collapsable',
                                                    children: [
                                                        {
                                                            id: 'navigation-features.level.0.1.2.3.4',
                                                            title: 'Level 4',
                                                            type: 'collapsable',
                                                            children: [
                                                                {
                                                                    id: 'navigation-features.level.0.1.2.3.4.5',
                                                                    title: 'Level 5',
                                                                    type: 'collapsable',
                                                                    children: [
                                                                        {
                                                                            id: 'navigation-features.level.0.1.2.3.4.5.6',
                                                                            title: 'Level 6',
                                                                            type: 'basic',
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'navigation-features.level.0',
                            title: 'Level 0',
                            subtitle: 'With subtitle',
                            icon: 'mat_outline:check-circle',
                            type: 'collapsable',
                            children: [
                                {
                                    id: 'navigation-features.level.0.1-1',
                                    title: 'Level 1.1',
                                    type: 'basic',
                                },
                                {
                                    id: 'navigation-features.level.0.1-2',
                                    title: 'Level 1.2',
                                    type: 'basic',
                                },
                            ],
                        },
                        {
                            id: 'navigation-features.active',
                            title: 'Active item',
                            subtitle: 'Manually marked as active',
                            icon: 'mat_outline:check-circle',
                            type: 'basic',
                            active: true,
                        },
                        {
                            id: 'navigation-features.disabled-collapsable',
                            title: 'Disabled collapsable',
                            subtitle: 'Some subtitle',
                            icon: 'mat_outline:check-circle',
                            type: 'collapsable',
                            disabled: true,
                            children: [
                                {
                                    id: 'navigation-features.disabled-collapsable.child',
                                    title: "You shouldn't be able to see this child",
                                    type: 'basic',
                                },
                            ],
                        },
                        {
                            id: 'navigation-features.disabled-basic',
                            title: 'Disabled basic',
                            subtitle: 'Some subtitle',
                            icon: 'mat_outline:check-circle',
                            type: 'basic',
                            disabled: true,
                        },
                        {
                            id: 'navigation-features.badge-style-oval',
                            title: 'Oval badge',
                            icon: 'mat_outline:tag',
                            type: 'basic',
                            badge: {
                                title: '8',
                                classes:
                                    'w-5 h-5 bg-teal-400 text-black rounded-full',
                            },
                        },
                        {
                            id: 'navigation-features.badge-style-rectangle',
                            title: 'Rectangle badge',
                            icon: 'mat_outline:tag',
                            type: 'basic',
                            badge: {
                                title: 'Updated!',
                                classes: 'px-2 bg-teal-400 text-black rounded',
                            },
                        },
                        {
                            id: 'navigation-features.badge-style-rounded',
                            title: 'Rounded badge',
                            icon: 'mat_outline:tag',
                            type: 'basic',
                            badge: {
                                title: 'NEW',
                                classes:
                                    'px-2.5 bg-teal-400 text-black rounded-full',
                            },
                        },
                        {
                            id: 'navigation-features.badge-style-simple',
                            title: 'Simple badge',
                            icon: 'mat_outline:tag',
                            type: 'basic',
                            badge: {
                                title: '87 Unread',
                                classes: 'text-teal-500',
                            },
                        },
                        {
                            id: 'navigation-features.multi-line',
                            title: 'A multi line navigation item title example which works just fine',
                            icon: 'mat_outline:check-circle',
                            type: 'basic',
                        },
                    ],
                },
            ],
            futuristic: [],
            horizontal: [],
        };
    }
}
