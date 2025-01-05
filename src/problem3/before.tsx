interface WalletBalance {
    currency: string;
    amount: number;
    /**
     * add "blockchain: string;" property to this interface 
     * to remove the error message: "Property 'blockchain' does not exist on type 'WalletBalance'".
     */
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
    /**
     * the following properties should be added to this interface 
     * priority: number;
     * usdValue: number;
     * priority: number;
     */
}

interface Props extends BoxProps {
    /**
     * add "children: React.ReactNode;" property to this interface 
     * to remove the error message: Property 'children' does not exist on type 'Props'.
     */
}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    /**
     * The use of switch case statements in this case is cumbersome, and should be replaced with an object.
     */
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        /**
         * The filter method call could be avoided by using an if statement in a loop to get balance records that meet the condition. 
         * This loop could also be used to attach the neccessary properties to balance records.
         */
        return balances.filter((balance: WalletBalance) => {
            /**
             * lhsPriority variable in the if statement is not defined, it should be replaced with balancePriority
             */
            /**
             * The if statement is too complicated, it can be simplified to 
             * return lhsPriority > -99 && balance.amount <= 0;
             */
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            /**
             * The getPriority function is called too many times. 
             * At the beginning, we should attach priority property to each balance records. 
             * This will minimize the number of getPriority calls.
             */
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            /**
             * The if statement is unnecessarily complicated, it can be simplified to
             * return rightPriority - leftPriority;
             */
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances, prices]);

    /**
     * The map method is called too many times, this leads to more computing time, 
     * since the balances array will be looped over multiple times.
     * It would be better to loop over the balances array once and do all neccessary work on balances array.
     */
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        /**
         * Like I mentioned earlier, usdValue coud be attached to each balance record at the beginning.
         */
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}