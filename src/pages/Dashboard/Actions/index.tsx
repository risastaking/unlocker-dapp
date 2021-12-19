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
  BigUIntValue
} from "@elrondnetwork/erdjs";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BigNumber } from "bignumber.js"
import { contractAddress, fromToken } from "../../../config";
import { routeNames } from "../../../routes";
import { useContext } from "../../../context";
import denominate from "../../../components/Denominate/denominate";
import { SyntheticEvent, useState } from "react";
import { NftType } from "components/NftBlock";

import MexIcon from "../../../assets/img/mex.svg"
import { Ui } from "@elrondnetwork/dapp-utils";
import { sortNftAmounts } from "../../../helpers";

const FEE_BASIS = new BigNumber(10000)
const BIG_ZERO = new BigNumber(0).precision(18)
const BIG_ONE = new BigNumber(1).precision(18)

const Actions = () => {
  const { nftBalance } = useContext();
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp, explorerAddress, chainId } = Dapp.useContext();
  const [fee, setFee] = React.useState<BigNumber>(FEE_BASIS);
  const [liquidity, setLiquidity] = React.useState<BigNumber>(BIG_ZERO);
  const [selectedToken, setSelectedToken] = useState<NftType>();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const percentAvailable = BIG_ONE.minus(fee.div(FEE_BASIS))
  const availableLiquidity = liquidity.multipliedBy(percentAvailable).dp(0).toFixed()

  const handleTokenSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
    const token = nftBalance.find(t => t.identifier === e.currentTarget.value)

    const balance = denominate({
      input: token?.balance || '',
      denomination: token?.decimals || 0,
      decimals: 2,
      showLastNonZeroDecimal: false,
      addCommas: false
    })

    setSelectedToken(token)
    setAmount(balance)
  };

  const handleAmountChange = (e: SyntheticEvent<HTMLInputElement, Event>) => {
    const value = e.currentTarget.value
    const amount_big = new BigNumber(value + `e+18`)
    if (amount_big && amount_big.gte(availableLiquidity)) {
      setError("Not enough liquidity. Please try a lower amount.")
    } else {
      setError('')
    }
    setAmount(value)
    e.preventDefault();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    const amount_big = new BigNumber(amount + `e+18`)
    const balance_big = new BigNumber(selectedToken?.balance || 0 + `e+18`)
    if (amount_big.gte(availableLiquidity)) {
      setError("Not enough liquidity. Please try a lower amount.")
    } else if (!selectedToken) {
      setError("Please select a token to unlock.")
    } else if (!amount) {
      setError("Please enter an amount to unlock.")
    } else if (balance_big.lt(amount_big)) {
      setError("Insufficient funds.")
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
      .setFunction(new ContractFunction("ESDTNFTTransfer"))
      .setArgs([
        BytesValue.fromUTF8(token.collection),
        new U64Value(new BigNumber(token.nonce)),
        new BigUIntValue(new BigNumber(amount_big)),
        new AddressValue(new Address(contractAddress)),
        BytesValue.fromUTF8("swap")
      ])
      .build();

    return new Transaction({
      receiver: new Address(address),
      gasLimit: new GasLimit(5000000),
      data: payload,
      chainID: chainId,
    });

  }

  let contract = new SmartContract({ address: new Address(contractAddress) });
  React.useEffect(() => {
    const fetchFee = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getFee"),
        args: []
      });
      let fee_bytes = Buffer.from(response.returnData[0], 'base64')
      let fee_int = new BigNumber('0x' + fee_bytes.toString("hex"))
      setFee(fee_int)
    }
    const fetchLiquidity = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getLiquidityBalance"),
        args: []
      });

      let liquidity_bytes = Buffer.from(response.returnData[0], 'base64')
      let liquidity = new BigNumber('0x' + liquidity_bytes.toString("hex"))
      setLiquidity(liquidity.isPositive() ? liquidity : new BigNumber(0))
    }

    fetchFee()

    fetchLiquidity()
  }, [])


  return (

    <div className="row mb-3">
      <div className="col-sm-6">
        <div className="card shadow-sm rounded p-4 mb-3">
          <div className="card-body">
            <h5 className="card-title">Unlock MEX</h5>

            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="unlock-token-select">
                <img src={`https://media.elrond.com/tokens/asset/${fromToken}/logo.svg`} alt="LockedMEX" className="token-icon me-2" />
                LKMEX
              </label>
              <select defaultValue={''} className="form-select" id="unlock-token-select" onChange={handleTokenSelect}>
                <option></option>
                {nftBalance?.filter(t => t.collection === fromToken)
                  .sort(sortNftAmounts)
                  .map(t =>
                    <option key={t.identifier} value={t.identifier}>
                      Balance: {denominate({
                        input: t.balance || '',
                        denomination: t.decimals || 0,
                        decimals: 2,
                        showLastNonZeroDecimal: false
                      })}
                    </option>
                  )}
              </select>
            </div>


            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="amount-to-swap">Amount</label>
              <input type="number" inputMode="numeric" className="form-control" value={amount} onChange={handleAmountChange} id="amount-to-swap" />
            </div>


            <div className="mb-3 d-flex mt-4 justify-content-center error">
              {error}
            </div>

            <a href="#" onClick={handleSubmit} className="btn btn-primary">Unlock</a>


            <div className="mb-3 d-flex mt-4 justify-content-center">*{denominate({
              input: fee?.toString() || '',
              denomination: 2,
              decimals: 2,
              showLastNonZeroDecimal: true
            })}% unlock fee will be deducted from sent MEX.</div>

          </div>
        </div>
      </div>
      <div className="col-sm-6">


        <div className="card shadow-sm rounded p-4">
          <div className="card-body text-center">

            <h2 className="mb-3" data-testid="title">
              Available Liquidity
            </h2>
            <h4>{denominate({
              input: availableLiquidity?.toString() || '',
              denomination: 18,
              decimals: 0,
              showLastNonZeroDecimal: false
            })} <MexIcon className="token-icon-large" />MEX</h4>

            <h2 className="mb-3" data-testid="title">
              Unlock Fee
            </h2>
            <h3>{denominate({
              input: fee?.toString() || '',
              denomination: 2,
              decimals: 2,
              showLastNonZeroDecimal: true
            })}%</h3>



          </div>
        </div>


      </div>
    </div>



  );
};

export default Actions;
