interface TimeType {
    hour: string;
    minute: string;
    second: string;
}
export declare function useTimer(props: { time?: TimeType }): TimeType;