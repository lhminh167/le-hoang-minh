import { Validator } from "fluentvalidation-ts";

export interface Token {
    currency: string;
    date: string;
    price: number
}

export interface GetOutputAmountForm {
    tokens: string[];
    inputCurrency: string;
    outputCurrency: string;
    inputAmount: string;
    outputAmount: number;
    error: {
        inputCurrency: string;
        outputCurrency: string;
        inputAmount: string;
    },
    isLoading: boolean,
    submitted: boolean,
}

export const defaultGetOutputAmountForm: GetOutputAmountForm = {
    tokens: [],
    inputCurrency: '',
    outputCurrency: '',
    inputAmount: '',
    outputAmount: 0,
    error: {
        inputCurrency: '',
        outputCurrency: '',
        inputAmount: '',
    },
    isLoading: false,
    submitted: false,
}

export interface GetOutputAmountRequest {
    inputCurrency: string;
    outputCurrency: string;
    inputAmount: number;
}

export interface GetOutputAmountResponse {
    outputAmount: number;
}

export interface GetTokensResponse {
    tokens: string[];
}

export interface ApiResponse<T> {
    payload: T;
    errorMessage: string;
}


export class GetOutputAmountRequestValidator extends Validator<GetOutputAmountForm> {
    constructor() {
        super();
        this.ruleFor('inputCurrency').notEmpty().withMessage('Please select currency to send')
        this.ruleFor('outputCurrency').notEmpty().withMessage('Please select currency to receive');
        this.ruleForTransformed('inputAmount', (value) => Number(value))
            .must((value) => !isNaN(value)).withMessage('Amount to send must be a number')
            .greaterThan(0).withMessage('Amount to send must be a positive number');
    }
}

export function isValidForm(form: any): boolean {
    return Object.entries(form).length === 0 && form.constructor === Object;
}