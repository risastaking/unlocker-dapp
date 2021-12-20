import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { Ui } from "@elrondnetwork/dapp-utils";
import moment from "moment";
import Denominate from "/src/components/Denominate";
import { TransactionType } from "context/state";
import StatusIcon from "./StatusIcon";
import txStatus from "./txStatus";
import OperationsList from './OperationsList';

function sortByDate(a: TransactionType, b: TransactionType) {
  if (a.timestamp < b.timestamp) {
    return 1;
  }
  if (a.timestamp > b.timestamp) {
    return -1;
  }
  return 0;
}

const fakeSender =
  "erd000000000000000000000000000000000000000000000000000000000a";

const TransactionList = ({
  transactions,
}: {
  transactions: TransactionType[];
}) => {
  const { address, explorerAddress } = Dapp.useContext();
  const incoming = (sender: string) =>
    sender === address && sender !== fakeSender;

  // eslint-disable-next-line
  const doubleOwnTransactions = transactions?.filter((tx) => tx.sender === tx.receiver && tx.blockHash !== "")
    .map((tx) => ({ ...tx, sender: fakeSender, timestamp: tx.timestamp + 1 }));

  const sortedTransactions: TransactionType[] = (
    [
      ...transactions,
      //...(doubleOwnTransactions.length > 0 ? doubleOwnTransactions : []),
    ].filter((el: any) => el !== undefined) as any
  )?.sort(sortByDate);

  return (
    <div className="p-3 mt-3">
      <h4 className="mb-3 font-weight-normal">Recent Transactions</h4>
      <div className="table-responsive">
        <table className="transactions table pb-3">
          <thead>
            <tr>
              <th className="border-0 font-weight-normal"></th>
              {/* <th className="border-0 font-weight-normal">Tx hash</th> */}
              <th className="border-0 font-weight-normal">Date</th>
              <th className="border-0 font-weight-normal">Token Operations</th>
            </tr>
          </thead>
          <tbody data-testid="transactionsList">
            {sortedTransactions?.map((tx: TransactionType, i) => {
              const incomingTransaction = incoming(tx.sender);
              return (
                <tr key={tx.txHash + i}>
                  <td>
                    <div
                      className="transaction-icon bg-light d-flex align-items-center justify-content-center"
                      title={txStatus[tx.status]}
                    >
                      <StatusIcon
                        tx={tx}
                        incomingTransaction={incomingTransaction}
                      />
                    </div>
                  </td>
                  <td>
                    {moment.unix(tx.timestamp).format("MMM Do, h:mm A")}
                  </td>
                  <td>
                    {tx.operations ?
                      <OperationsList operations={tx.operations}></OperationsList>
                      : tx.data ? (atob(tx.data)?.split("@")[0]) : ''
                    }

                    <div className="mr-2 text-nowrap">Tx Hash:</div>
                    <a
                      href={`${explorerAddress}/transactions/${tx.txHash}`}
                      {...{
                        target: "_blank",
                      }}
                      title="View in Explorer"
                    >
                      <Ui.Trim data-testid="txHash" text={tx.txHash} color="text-muted" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <a
          href={`${explorerAddress}/address/${address}`}
          {...{
            target: "_blank",
          }}
        >
          See all transactions
        </a>
      </div>
    </div>
  );
};

export default TransactionList;