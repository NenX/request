import { ResponseError, RequestOptionsInit } from 'umi-request';
export interface ErrData {
    status: number;
    errortext: string;
    url: string;
    data: any;
}
export interface RequestOptions extends RequestOptionsInit {
    hideErr?: boolean;
    loading?: string;
    successText?: string;
    interval?: number;
    cacheWhenFailed?: boolean;
}
export declare type getErrDataType = (err: ResponseError) => ErrData;
export interface Iconfig extends RequestOptionsInit {
    errHandler?: (err: ErrData) => any;
    Authorization?: string;
    [x: string]: any;
    hideErr?: boolean;
}
