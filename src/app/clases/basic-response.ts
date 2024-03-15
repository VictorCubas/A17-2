export interface BasicResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: any;
}
