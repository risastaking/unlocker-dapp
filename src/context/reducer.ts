import { OperationType, StateType, TransactionType } from "./state";

export type ActionType = {
  type: "setTransactions" | "setTransactionOperations" | "setNftBalance";
  operations: OperationType[];
  txHash: string;
  transactions: TransactionType[];
  transactionsFetched: StateType["transactionsFetched"];
  nftBalance: any[]
};

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "setTransactions": {
      const newState: StateType = {
        ...state,
        transactions: action.transactions,
        transactionsFetched: action.transactionsFetched,
      };
      return newState;
    }
    case "setTransactionOperations": {
      let found = state.transactions.findIndex(
        (t) => t.txHash === action.txHash
      );
      state.transactions[found].operations = action.operations;
      const newState: StateType = {
        ...state,
        transactions: state.transactions,
        transactionsFetched: action.transactionsFetched,
      };
      return newState;
    }
    case "setNftBalance": {
      const newState: StateType = {
        ...state,
        nftBalance: action.nftBalance
      };
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action?.type}`);
    }
  }
}
