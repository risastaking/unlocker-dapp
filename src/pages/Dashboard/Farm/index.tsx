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
import { contractAddress, toToken } from "../../../config";
import { routeNames } from "../../../routes";
import { useContext } from "../../../context";
import denominate from "../../../components/Denominate/denominate";
import { SyntheticEvent, useState } from "react";
import { TokenType } from "components/NftBlock";

import MexIcon from "../../../assets/img/mex.svg"
import { Ui } from "@elrondnetwork/dapp-utils";
import Harvest from "./Harvest";

const BIG_ZERO = new BigNumber(0).precision(18)

const Actions = () => {

  const [fee, setFee] = React.useState<BigNumber>(BIG_ZERO);
  const { tokenBalance } = useContext();
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp, explorerAddress, chainId } = Dapp.useContext();
  const [balance, setBalance] = React.useState<BigNumber>(BIG_ZERO);
  const [selectedToken, setSelectedToken] = useState<TokenType>();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTokenSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
    const token = tokenBalance.find(t => t.identifier === e.currentTarget.value)

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
    setAmount(value)
    setError('')
    e.preventDefault();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    const amount_big = new BigNumber(amount + `e+18`)
    const balance_big = new BigNumber(selectedToken?.balance || 0 + `e+18`)

    if (!selectedToken) {
      setError("Please select a token to deposit.")
    } else if (!amount) {
      setError("Please enter an amount to deposit.")
    } else if (balance_big.lt(amount_big)) {
      setError("Insufficient funds.")
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

  const buildTransaction = (token: TokenType, amount: string): Transaction => {
    const amount_big = amount + `e+${token.decimals}`
    const payload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction("ESDTTransfer"))
      .setArgs([
        BytesValue.fromUTF8(token.identifier),
        new BigUIntValue(new BigNumber(amount_big)),
        BytesValue.fromUTF8("deposit")
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
    const fetchFee = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getFee"),
        args: []
      });
      let fee_bytes = Buffer.from(response.returnData[0], 'base64')
      let fee_int = new BigNumber('0x' + fee_bytes.toString("hex"))
      setFee(fee_int)
    }

    fetchFee()
  }, [])


  return (

    <div className="row mb-3">
      <div className="col-sm-6">
        <div className="card shadow-sm rounded p-4 mb-3">
          <div className="card-body">
            <h5 className="card-title">Lock MEX</h5>


            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="lock-token-select">
                <img src={`https://media.elrond.com/tokens/asset/${toToken}/logo.svg`} alt="MEX" className="token-icon me-2" />
                MEX
              </label>
              <select defaultValue={''} className="form-select" id="lock-token-select" onChange={handleTokenSelect}>
                <option></option>
                {tokenBalance?.filter(t => t.identifier === toToken).map(t =>
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
              <label className="input-group-text" htmlFor="amount-to-deposit">Amount</label>
              <input type="number" inputMode="numeric" className="form-control" value={amount}
                onChange={handleAmountChange} id="amount-to-deposit" />
            </div>

            <div className="mb-3 d-flex mt-4 justify-content-center error">
              {error}
            </div>

            <a href="#" onClick={handleSubmit} className="btn btn-primary">Stake</a>

            {fee ?
              <div className="mb-3 d-flex mt-4 justify-content-center">*Lock your MEX and harvest as LKMEX + {denominate({
                input: fee?.toString() || '',
                denomination: 2,
                decimals: 2,
                showLastNonZeroDecimal: true
              })}% rewards.</div>
              : ''}

          </div>
        </div>
      </div>
      <div className="col-sm-6">


        <Harvest></Harvest>


      </div>
    </div>



  );
};

export default Actions;
