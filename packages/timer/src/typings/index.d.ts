interface TimeType {
    hour: string;
    minute: string;
    second: string;
}
export declare const useTimer: (props: { time?: TimeType }) => TimeType;