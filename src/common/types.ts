
export type OptionValue = string | number;

export type IOption<T extends OptionValue> = {
    value: T;
    label: string;
    color?: string;
    checked?: boolean;
};