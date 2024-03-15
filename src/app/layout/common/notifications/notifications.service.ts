import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { SettingsService } from 'app/services/settings.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService
{

    cantidadSinLeer: BehaviorSubject<number> = new BehaviorSubject(0);

    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private settings: SettingsService,)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]>
    {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<Notification[]>
    {
        return this._httpClient.get<Notification[]>('api/common/notifications').pipe(
            tap((notifications) => {
                this._notifications.next(notifications);
            })
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('api/common/notifications', {notification}).pipe(
                map((newNotification) => {

                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                })
            ))
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.patch<Notification>('api/common/notifications', {
                id,
                notification
            }).pipe(
                map((updatedNotification: Notification) => {

                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Update the notification
                    notifications[index] = updatedNotification;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                })
            ))
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Integracion de notificaciones
     */

    /**
     * Lista la cantudad de notificaciones pendientes de lectura
     *
     * @returns cantidad de notificaciones
     */
    listarPendientes(): Observable<any> {
        return this._httpClient.get(`${this.settings.URL_BASE}/fraccionate/notificaciones/cant_sin_leer`);
    }

    marcarComoLeido(id: string): Observable<any> {
        return this._httpClient.put(`${this.settings.URL_BASE}/fraccionate/notificaciones/leido/${id}`, {});
    }

    /**
     * Recupera listado de notificaciones
     *
     * @param data datos de paginacion
     * @returns recupera el listado de notificaciones pendientes de lectura
     */
    listarNotificaciones(data = { pagina: 1, cantidadPagina: 50 }): Observable<any> {
        return this._httpClient.post(`${this.settings.URL_BASE}/fraccionate/notificaciones`, data).pipe(map( (resp: { data: Array<any>; pagination: any }) => {

            const dataList = [];

            resp.data.forEach( (e: any) => {
                const noti: Notification = { id: '', title: '', description: '', read: false,
                time: '', icon: '', image: '', link: null, useRouter: true };

                noti.id = e.id;
                noti.title = e.asunto;
                noti.description = e.mensaje;
                noti.read = e.leido;
                noti.time = e.fecha_entrega;
                noti.link = e.componente.includes('comercio') ? e.componente : null;
                noti.useRouter = noti.link ? true : false;

                dataList.push(noti);
            });

            resp.data = dataList;
            return resp;

        }));
    }

    /**
     * Permite marcar todas las notificaciones pendientes como leídas.
     *
     * @returns success, marcar todo como leído
     */
    marcarTodoComoLeido(): Observable<any> {
        return this._httpClient.put(`${this.settings.URL_BASE}/fraccionate/notificaciones/leido/all`, {});
    }
}
