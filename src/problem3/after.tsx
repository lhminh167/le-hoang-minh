interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
    priority: number;
    usdValue: number;
    formatted: string;
}

interface Props extends BoxProps {
    children: React.ReactNode;
}
const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
    const balances = useWalletBalances();
    const prices = usePrices();

    const priority = {
        'Osmosis': 100,
        'Ethereum': 50,
        'Arbitrum': 30,
        'Zilliqa': 20,
        'Neo': 20
    }
    const getPriority = (blockchain: string): number => priority[blockchain] ?? -99;

    const sortedBalances = useMemo(() => {

        const formattedBalances: FormattedWalletBalance[] = [];

        balances.forEach((balance: WalletBalance) => {

            const priority = getPriority(balance.blockchain);
            const condition = priority > -99 && balance.amount <= 0;
            if (!condition) return;

            formattedBalances.push({
                ...balance,
                priority,
                usdValue: prices[balance.currency] * balance.amount,
                formatted: balance.amount.toFixed(),
            });
        });

        return formattedBalances.sort((lhs, rhs) => rhs.priority - lhs.priority);

    }, [balances, prices]);

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={balance.usdValue}
            formattedAmount={balance.formatted}
        />
    )

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}