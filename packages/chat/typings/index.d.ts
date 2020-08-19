import { RefObject } from 'react'
interface propsType<T> {
    ref: RefObject<T>;
    load: (data: any) => Promise<any>;
    flag: number;
}
export declare function useChat<T extends HTMLElement = HTMLElement>(props: propsType<T>): { msgs: any[]; addMsg: (data: any[]) => void; }