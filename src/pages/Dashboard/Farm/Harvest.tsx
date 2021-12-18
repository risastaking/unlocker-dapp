import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
    Address,
    AddressValue,
    ContractFunction,
    BytesValue,
    SmartContract,
    GasLimit,
    TransactionPayload,
    Transaction,
    U64Value,
    BigUIntValue,
    TypedValue
} from "@elrondnetwork/erdjs";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BigNumber } from "bignumber.js"
import { contractAddress, fromToken } from "../../../config";
import { routeNames } from "../../../routes";
import { useContext } from "../../../context";
import denominate from "../../../components/Denominate/denominate";
import { SyntheticEvent, useState } from "react";
import { NftType, TokenType } from "components/NftBlock";


import LKMexIcon from "../../../assets/img/lkmex.svg"
import { Ui } from "@elrondnetwork/dapp-utils";
import axios from "axios";
import { sortNftAmounts } from "../../../helpers";


const BIG_ZERO = new BigNumber(0).precision(18)

const Harvest = () => {
    const sendTransaction = Dapp.useSendTransaction();
    const { address, dapp, apiAddress, chainId } = Dapp.useContext();
    const [contractTokenBalance, setContractTokenBalance] = React.useState<NftType[]>([]);
    const [balance, setBalance] = React.useState<BigNumber>(BIG_ZERO);
    const [selectedToken, setSelectedToken] = useState<NftType>();
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleMax = (e: SyntheticEvent<HTMLButtonElement, Event>) => {
        const amt = denominate({
            input: balance?.dp(0).toFixed() || '',
            denomination: 18,
            decimals: 2,
            showLastNonZeroDecimal: false,
            addCommas: false
        })
        setAmount(amt)
        e.preventDefault();
    };


    const handleTokenSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
        const token = contractTokenBalance.find(t => t.identifier === e.currentTarget.value)

        setSelectedToken(token)
    };

    const handleAmountChange = (e: SyntheticEvent<HTMLInputElement, Event>) => {
        const value = e.currentTarget.value
        setAmount(value)
        setError('')
        e.preventDefault();
    };

    const handleSubmit = (e: React.MouseEvent) => {
        const amount_big = new BigNumber(amount + `e+18`)
        const balance_big = new BigNumber(selectedToken?.balance || 0 + `e+18`)

        if (!selectedToken) {
            setError("Please select a token to harvest.")
        } else if (!amount) {
            setError("Please enter an amount to harvest.")
        } else if (balance_big.lt(amount_big)) {
            setError("Not enough liquidity. Please try a different contract token.")
        } else if (amount_big.eq(0)) {
            setError("Amount must be greater than 0.")
        } else {
            send(buildTransaction(selectedToken, amount))
        }
        e.preventDefault();
    }
    const send = (transaction: Transaction) => {
        sendTransaction({
            transaction: transaction,
            callbackRoute: routeNames.transaction,
        });
    };

    const buildTransaction = (token: NftType, amount: string): Transaction => {
        const amount_big = amount + `e+${token.decimals}`
        const payload = TransactionPayload.contractCall()
            .setFunction(new ContractFunction("harvest"))
            .setArgs([
                BytesValue.fromUTF8(token.collection),
                new U64Value(new BigNumber(token.nonce)),
                new BigUIntValue(new BigNumber(amount_big))
            ])
            .build();

        return new Transaction({
            receiver: new Address(contractAddress),
            gasLimit: new GasLimit(5000000),
            data: payload,
            chainID: chainId,
        });

    }

    let contract = new SmartContract({ address: new Address(contractAddress) });

    React.useEffect(() => {
        const fetchBalance = async () => {
            let response = await contract.runQuery(dapp.proxy, {
                func: new ContractFunction("getBalance"),
                args: [new AddressValue(new Address(address))]
            });
            let balance_bytes = Buffer.from(response.returnData[0], 'base64')
            let balance_int = new BigNumber('0x' + balance_bytes.toString("hex"))

            setBalance(balance_int)
        }
        const fetchContractTokenBalance = async () => {
            try {
                const { data } = await axios.get(`${apiAddress}/accounts/${contractAddress}/nfts`, {
                    params: {},
                    timeout: 3000,
                });

                setContractTokenBalance(data)
            } catch (err) {
                setError('Unable to load contract tokens.')
            }
        };

        fetchContractTokenBalance()
        fetchBalance()
    }, [])


    return (



        <div className="card shadow-sm rounded p-4">
            <div className="card-body text-center">
                <h2 className="mb-3" data-testid="title">
                    Rewards
                </h2>
                <h4>{denominate({
                    input: balance?.dp(0).toFixed() || '',
                    denomination: 18,
                    decimals: 2,
                    showLastNonZeroDecimal: false
                })} <LKMexIcon className="token-icon-large" />LKMEX</h4>


                <div className="input-group mb-3 mt-5">
                    <label className="input-group-text" htmlFor="amount-to-harvest">Amount</label>
                    <input type="number" inputMode="numeric" className="form-control" value={amount}
                        aria-describedby="button-addon2"
                        onChange={handleAmountChange} id="amount-to-harvest" />
                    <button className="btn btn-outline-secondary" type="button" onClick={handleMax} id="button-addon2">Max</button>
                </div>


                <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="harvest-token-select">
                        Harvest From
                    </label>
                    <select defaultValue={''} className="form-select" id="harvest-token-select" onChange={handleTokenSelect}>
                        <option></option>
                        {contractTokenBalance?.filter(t => t.collection === fromToken)
                            .sort(sortNftAmounts)
                            .map(t =>
                                <option key={t.identifier} value={t.identifier}>
                                    {t.ticker} Pool: {denominate({
                                        input: t.balance || '',
                                        denomination: t.decimals || 0,
                                        decimals: 2,
                                        showLastNonZeroDecimal: false
                                    })}
                                </option>
                            )}
                    </select>
                </div>





                <div className="mb-3 d-flex mt-4 justify-content-center error">
                    {error}
                </div>

                <a href="#" onClick={handleSubmit} className="btn btn-primary">Harvest</a>


            </div>





        </div>





    );
};

export default Harvest;
