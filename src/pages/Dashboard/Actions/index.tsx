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

const FEE_BASIS = new BigNumber(10000)
const BIG_ZERO = new BigNumber(0)
const BIG_ONE = new BigNumber(1)

const Actions = () => {
  const { nftBalance } = useContext();
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp } = Dapp.useContext();
  const [fee, setFee] = React.useState<BigNumber>(FEE_BASIS);
  const [liquidity, setLiquidity] = React.useState<BigNumber>(BIG_ZERO);
  const [selectedToken, setSelectedToken] = useState<NftType>();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const percentAvailable = BIG_ONE.minus(fee.div(FEE_BASIS))
  const availableLiquidity = liquidity.multipliedBy(percentAvailable)

  const handleTokenSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
    setSelectedToken(nftBalance.find(t => t.identifier === e.currentTarget.value))
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
    if (amount_big.gte(availableLiquidity)) {
      setError("Not enough liquidity. Please try a lower amount.")
    } else if (!selectedToken) {
      setError("Please select a token to unlock.")
    } else if (!amount) {
      setError("Please enter an amount to unlock.")
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
        BytesValue.fromUTF8(token.ticker),
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
      console.log(fee_int)
      setFee(fee_int)
    }
    const fetchLiquidity = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getLiquidityBalance"),
        args: []
      });

      let liquidity_bytes = Buffer.from(response.returnData[0], 'base64')
      let liquidity = new BigNumber('0x' + liquidity_bytes.toString("hex"))
      console.log(liquidity)
      setLiquidity(liquidity)
    }

    fetchFee()

    fetchLiquidity()
  }, [])


  return (

    <><div className="d-flex mt-4 justify-content-center">
      <input type="number" placeholder="Amount" onChange={handleAmountChange} id="amount-to-swap" />
      <select onChange={handleTokenSelect}>
        <option>Select...</option>
        {nftBalance?.filter(t => t.ticker === fromToken).map(t => <option key={t.identifier} value={t.identifier}>
          {t.identifier} - {denominate({
            input: t.balance || '',
            denomination: t.decimals || 0,
            decimals: 2,
            showLastNonZeroDecimal: false
          })}
        </option>
        )}
      </select>


      <div className="action-btn" onClick={handleSubmit}>
        <button className="btn">
          <FontAwesomeIcon icon={faArrowUp} className="text-primary" />
        </button>
        <a href="/" className="text-white text-decoration-none">
          Send LKMEX
        </a>
      </div>
      <div className="light-bg">Available Liquidity: {denominate({
        input: availableLiquidity?.toString() || '',
        denomination: 18,
        decimals: 2,
        showLastNonZeroDecimal: false
      })} MEX</div>
      <div className="light-bg">Fee: {denominate({
        input: fee?.toString() || '',
        denomination: 2,
        decimals: 2,
        showLastNonZeroDecimal: true
      })}%</div>
    </div>
      <div className="d-flex mt-4 justify-content-center error">
        {error}
      </div>
    </>
  );
};

export default Actions;
