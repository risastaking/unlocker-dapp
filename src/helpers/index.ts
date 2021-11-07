import BigNumber from 'bignumber.js';

export const urlBuilder = {
    shard: (shard: number | string) => `/blocks?shard=${shard}`,
    receiverShard: (shard: number | string) => `/transactions?receivershard=${shard}`,
    senderShard: (shard: number | string) => `/transactions?sendershard=${shard}`,
    transactionDetails: (hash: number | string) => `/transactions/${hash}`,
    transactionDetailsScResults: (hash: string) => `/transactions/${hash}/sc-results`,
    transactionDetailsLogs: (hash: string) => `/transactions/${hash}/logs`,
    nodeDetails: (publicKey: string) => `/nodes/${publicKey}`,
    accountDetails: (address: string) => `/accounts/${address}`,
    accountDetailsContractCode: (address: string) => `/accounts/${address}/code`,
    accountDetailsTokens: (address: string) => `/accounts/${address}/tokens`,
    accountDetailsNfts: (address: string) => `/accounts/${address}/nfts`,
    accountDetailsScResults: (address: string) => `/accounts/${address}/sc-results`,
    identityDetails: (id: string) => `/identities/${id}`,
    tokenDetails: (tokenId: string) => `/tokens/${tokenId}`,
    tokenDetailsAccounts: (tokenId: string) => `/tokens/${tokenId}/accounts`,
    collectionDetails: (identifier: string) => `/collections/${identifier}`,
    nftDetails: (identifier: string) => `/nfts/${identifier}`,
    providerDetails: (address: string) => `/providers/${address}`,
    providerDetailsTransactions: (address: string) => `/providers/${address}/transactions`,
  };

export const stringIsInteger = (integer: string, positiveNumbersOnly = true) => {
  const stringInteger = String(integer);
  if (!stringInteger.match(/^[-]?\d+$/)) {
    return false;
  }
  const bNparsed = new BigNumber(stringInteger);
  const limit = positiveNumbersOnly ? 0 : -1;
  return bNparsed.toString(10) === stringInteger && bNparsed.comparedTo(0) >= limit;
};