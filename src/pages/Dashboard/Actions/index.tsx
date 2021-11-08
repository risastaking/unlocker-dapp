import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
  Address,
  AddressValue,
  ContractFunction,
  Query,
  TransactionHash,
  EsdtHelpers,
  BytesValue,
  SmartContract,
  U32Value,
  GasLimit,
  ProxyProvider,
  NetworkConfig
} from "@elrondnetwork/erdjs";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BigNumber } from "bignumber.js"
import { contractAddress, fromToken } from "../../../config";
import { RawTransactionType } from "helpers/types";
import { routeNames } from "../../../routes";
import useNewTransaction from "../../Transaction/useNewTransaction";
import { useContext } from "../../../context";
import denominate from "../../../components/Denominate/denominate";
import { ReactEventHandler, SyntheticEvent, useState } from "react";
import { NftType } from "components/NftBlock";

const getTxFieldsForEsdtNftTransfer = (tokenIdentifier: string, nonce: number,
  amount: string, contractAddress: Address, functionName: string): { value: string, gasLimit: number, data: string } => {
  const encodedAmount = new BigNumber(amount, 10).toString(16);
  const encodedTokenId = tokenIdentifier.split("")
    .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
  const encodedContractAddress = contractAddress.hex()
  const encodedFunctionName = functionName.split("")
    .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
  const encodedNonce = nonce.toString(16)
  const txDataField = ["ESDTNFTTransfer", encodedTokenId,
  encodedNonce, encodedAmount, encodedContractAddress, encodedFunctionName].join("@");

  return {
    value: "0",
    gasLimit: 5000000,
    data: txDataField
  };
}

const Actions = () => {
  const { nftBalance } = useContext();
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp } = Dapp.useContext();
  const newTransaction = useNewTransaction();
  const [fee, setFee] = React.useState<number>();
  const [selectedToken, setSelectedToken] = useState<NftType>();

  const handleTokenSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
    debugger
    setSelectedToken(nftBalance.find(t => t.identifier === e.currentTarget.value))

  };
  const handleSubmit  = (e: React.MouseEvent) => {
    debugger
    e.preventDefault();
    selectedToken ?
      send(createTransaction(selectedToken, "15000000000000000000")) :
      () => null

  }
  const send = (transaction: RawTransactionType) => {
    sendTransaction({
      transaction: newTransaction(transaction),
      callbackRoute: routeNames.transaction,
    });
  };

  const createTransaction = (token: NftType, amount: string): RawTransactionType => ({
    receiver: address,
    ...getTxFieldsForEsdtNftTransfer(token.ticker, token.nonce,
      amount, new Address(contractAddress), "swap")
  });

  // utility functions
  let contract = new SmartContract({ address: new Address(contractAddress) });
  React.useEffect(() => {
    const fetchFee = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getFee"),
        args: []
      });
      let fee_bytes = Buffer.from(response.returnData[0], 'base64')
      let fee_int = parseInt(fee_bytes.toString("hex"), 16)
      console.log(fee_int)
      setFee(fee_int)
    }
    fetchFee()
  }, [])


  return (

    <div className="d-flex mt-4 justify-content-center">

      <input type="number" placeholder="Amount" step="1" id="amount-to-swap" />

      <select onChange={handleTokenSelect}>

        <option>Select...</option>
        {nftBalance?.filter(t => t.ticker === fromToken).map(t =>
          <option key={t.identifier} value={t.identifier} >
            {t.identifier} - {
              denominate({
                input: t.balance || '',
                denomination: t.decimals || 0,
                decimals: 2,
                showLastNonZeroDecimal: false
              })
            }
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
      <div className="light-bg">Fee: {
        denominate({
          input: fee?.toString() || '',
          denomination: 2,
          decimals: 2,
          showLastNonZeroDecimal: true
        })}%</div>
    </div >
  );
};

export default Actions;
