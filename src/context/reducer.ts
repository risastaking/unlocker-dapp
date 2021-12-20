import { OperationType, StateType, TransactionType } from "./state";

export type ActionType = {
  type: "setTransactions" | "setTransactionOperations" | "setNftBalance" | "setTokenBalance";
  operations: OperationType[];
  txHash: string;
  transactions: TransactionType[];
  transactionsFetched: StateType["transactionsFetched"];
  nftBalance: any[];
  tokenBalance: any[];
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
      let found = state.transactions?.findIndex(
        (t) => t.txHash === action.txHash
      );
      if (found) {
        state.transactions[found].operations = action.operations;
        const newState: StateType = {
          ...state,
          transactions: state.transactions,
          transactionsFetched: action.transactionsFetched,
        };
        return newState;
      }
      return state;
    }
    case "setNftBalance": {
      const newState: StateType = {
        ...state,
        nftBalance: action.nftBalance
      };
      return newState;
    }
    case "setTokenBalance": {
      const newState: StateType = {
        ...state,
        tokenBalance: action.tokenBalance
      };
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action?.type}`);
    }
  }
}
