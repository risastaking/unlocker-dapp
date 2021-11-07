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
  GasLimit
} from "@elrondnetwork/erdjs";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BigNumber } from "bignumber.js"
import { contractAddress } from "../../../config";
import { RawTransactionType } from "helpers/types";
import { routeNames } from "../../../routes";
import useNewTransaction from "../../Transaction/useNewTransaction";
import { useContext } from "../../../context";

const getTxFieldsForEsdtNftTransfer = (tokenIdentifier: string, nonce: string,
  amount: string, contractAddress: Address, functionName: string): { value: string, gasLimit: number, data: string } => {
  const encodedAmount = new BigNumber(amount, 10).toString(16);
  const encodedTokenId = tokenIdentifier.split("")
    .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
  const encodedContractAddress = contractAddress.hex()
  const encodedFunctionName = functionName.split("")
    .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")
  const txDataField = ["ESDTNFTTransfer", encodedTokenId,
    nonce, encodedAmount, encodedContractAddress, encodedFunctionName].join("@");

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
  const [result, setResult] = React.useState<string>();

  const send = (transaction: RawTransactionType) => (e: React.MouseEvent) => {
    e.preventDefault();
    sendTransaction({
      transaction: newTransaction(transaction),
      callbackRoute: routeNames.transaction,
    });
  };

  const sendLKMEXTransaction: RawTransactionType = {
    receiver: address,
    ...getTxFieldsForEsdtNftTransfer("LKMEX-cfa13d", "467e", "15000000000000000000", new Address(contractAddress), "swap")
  };
  // utility functions

  // let contract = new SmartContract({ address: new Address("erd1qqqqqqqqqqqqqpgqjlsjj5eat33z2r56nm456e75g8kt2unv3xaqwk2qdu") });
  // let callTransactionOne = contract.call({
  //   func: new ContractFunction("swap"),
  //   args: [new U32Value(5), BytesValue.fromHex("0123")],
  //   gasLimit: new GasLimit(150000)
  // });


  return (
    <>
      <div className="d-flex mt-4 justify-content-center">

      <input type="number" step="1" id="amount-to-swap" />
      <div className="action-btn" onClick={send(sendLKMEXTransaction)}>
              <button className="btn">
                <FontAwesomeIcon icon={faArrowUp} className="text-primary" />
              </button>
              <a href="/" className="text-white text-decoration-none">
                Send LKMEX
              </a>
            </div>
      </div>
    </>
  );
};

export default Actions;
