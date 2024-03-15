import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SettingsService } from '../services/settings.service';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private http: HttpClient, private settings: SettingsService) {}

    login(data: {
        username: string;
        password: string;
        aplicacionId: string;
        aplicacionVersion: string;
    }): Observable<any> {
        data.aplicacionId = this.settings.APP_ID;
        data.aplicacionVersion = this.settings.APP_VERSION;

        return this.http.post(this.settings.URL_BASE + 'login', data).pipe(
            map((resp: any) => {
                const menuUpdate = [];
                console.log(resp);
                resp.menuPermisos[0].menu.forEach((m: any) => {
                    const child = [];

                    if (m.menu) {
                        m.menu.forEach((sm: any) => {
                            child.push({
                                id: sm.id,
                                title: sm.nombre,
                                type: 'basic',
                                link: '/comercio/'+sm.url,
                                icon: sm.icono,
                            });
                        });
                    }

                    const newMenu = {
                        id: m.id,
                        title: m.nombre,
                        subtitle: m.nombre,
                        type: 'collapsable',
                        icon: 'home',
                        children: child,
                    };

                    menuUpdate.push(newMenu);
                });

                resp.menuPermisos = {
                    compact: menuUpdate,
                    default: menuUpdate,
                    futuristic: menuUpdate,
                    horizontal: menuUpdate,
                };
                return resp;
            })
        );
    }
}

// {
//     id      : 'apps',
//     title   : 'Applications',
//     subtitle: 'Custom made application designs',
//     type    : 'group',
//     icon    : 'mat_outline:home',
//     children: [
//         {
//             id   : 'apps.academy',
//             title: 'Academy',
//             type : 'basic',
//             icon : 'mat_outline:academic-cap',
//             link : '/apps/academy'
//         },
//         {
//             id   : 'apps.chat',
//             title: 'Chat',
//             type : 'basic',
//             icon : 'mat_outline:chat-alt',
//             link : '/apps/chat'
//         },
//         {
//             id   : 'apps.contacts',
//             title: 'Contacts',
//             type : 'basic',
//             icon : 'mat_outline:user-group',
//             link : '/apps/contacts'
//         },
//         {
//             id      : 'apps.ecommerce',
//             title   : 'ECommerce',
//             type    : 'collapsable',
//             icon    : 'mat_outline:shopping-cart',
//             children: [
//                 {
//                     id   : 'apps.ecommerce.inventory',
//                     title: 'Inventory',
//                     type : 'basic',
//                     link : '/apps/ecommerce/inventory'
//                 }
//             ]
//         },
//     }
//   ]
// }
