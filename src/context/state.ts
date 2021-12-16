import { NftType, TokenType } from "components/NftBlock";

interface ScResultType {
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  receiver?: string;
  sender: string;
  value: string;
  data?: string;
  returnMessage?: string;
}
export interface OperationType {
  action: string;
  type: string;
  collection?: string;
  identifier: string;
  sender: string;
  receiver: string;
  value: string;
}
type TxStatusType = "pending" | "notExecuted" | "success" | "fail";

export interface TransactionType {
  fee?: string;
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: string;
  txHash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: TxStatusType;
  timestamp: number;
  value: string;
  scResults?: ScResultType[];
  operations?: OperationType[];
}

export interface StateType {
  transactions: TransactionType[];
  transactionsFetched: boolean | undefined;
  nftBalance: NftType[];
  tokenBalance: TokenType[];
}

const initialState = (): StateType => {
  return {
    transactions: [],
    transactionsFetched: undefined,
    nftBalance: [],
    tokenBalance: []
  };
};

export default initialState;
