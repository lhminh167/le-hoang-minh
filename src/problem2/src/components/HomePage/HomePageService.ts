import { ApiResponse, GetOutputAmountRequest, GetOutputAmountResponse, GetTokensResponse, Token } from "./HomePageModel";
import { tokens } from "./tokens";

export async function getOutputAmount(input: GetOutputAmountRequest): Promise<ApiResponse<GetOutputAmountResponse>> {
    try {
        await wait();

        const inputCurrency = getUnduplicatedTokenList().find(token => token.currency === input.inputCurrency)
        const outputCurrency = getUnduplicatedTokenList().find(token => token.currency === input.outputCurrency)

        if (!inputCurrency || !outputCurrency)
            return {
                payload: { outputAmount: 0 },
                errorMessage: "Either input or output token not found"
            }

        const outputAmount = inputCurrency.price / outputCurrency.price * input.inputAmount;

        return {
            payload: { outputAmount },
            errorMessage: ""
        }
    } catch (error) {
        return {
            payload: { outputAmount: 0 },
            errorMessage: "Something went wrong. Please try again later."
        }
    }
}

export async function getTokens(): Promise<ApiResponse<GetTokensResponse>> {
    try {
        await wait();
        return {
            payload: { tokens: getUnduplicatedTokenList().map(token => token.currency) },
            errorMessage: ""
        }
    } catch (error) {
        return {
            payload: { tokens: [] },
            errorMessage: "Something went wrong. Please try again later."
        }
    }
}

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 1000));
}

// remove duplicated tokens from the original token list
function getUnduplicatedTokenList(): Token[] {
    const currencies = new Set();
    const list = tokens.filter(({ currency }) => !currencies.has(currency) && currencies.add(currency));
    return list
}