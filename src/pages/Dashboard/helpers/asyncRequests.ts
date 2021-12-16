import axios from "axios";

interface GetLatestTransactionsType {
  apiAddress: string;
  address: string;
  contractAddress: string;
  timeout: number;
  page?: number;
  url?: string;
  txHash?: string;
}

const fetchTransaction = (url: string) =>
  async function getTransaction({
    apiAddress,
    timeout,
    txHash
  }: GetLatestTransactionsType) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}/${txHash}`, {
        params: {},
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  const fetchToken = (url: string) =>
  async function getToken({
    apiAddress,
    timeout,
    identifier
  }: any) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}/${identifier}`, {
        params: {},
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  const fetchNft = (url: string) =>
  async function getNft({
    apiAddress,
    timeout,
    identifier
  }: any) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}/${identifier}`, {
        params: {},
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  const fetchNftBalance = (url: string) =>
  async function getNftBalance({
    apiAddress,
    address,
    timeout
  }: any) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}/${address}/nfts`, {
        params: {},
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

  const fetchTokenBalance = (url: string) =>
  async function getTokenBalance({
    apiAddress,
    address,
    timeout
  }: any) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}/${address}/tokens`, {
        params: {},
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

const fetchTransactions = (url: string) =>
  async function getTransactions({
    apiAddress,
    address,
    contractAddress,
    timeout,
  }: GetLatestTransactionsType) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}`, {
        params: {
          sender: address,
          condition: "must",
          size: 5,
        },
        timeout,
      });

      return {
        data: data,
        success: data !== undefined,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  };

export const getTransaction = fetchTransaction(`/transactions`)
export const getTransactions = fetchTransactions("/transactions");
export const getTransactionsCount = fetchTransactions("/transactions/count");
export const getToken = fetchToken("/tokens");
export const getNft = fetchNft("/nfts");
export const getNftBalance = fetchNftBalance("/accounts");
export const getTokenBalance = fetchTokenBalance("/accounts");
