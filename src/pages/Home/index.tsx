import * as React from "react";
import { Link } from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";
import { routeNames } from "../../routes";
import MexIcon from "../../assets/img/mex.svg"
import LKMexIcon from "../../assets/img/lkmex.svg"
import {
  faCircle,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { BigNumber } from "bignumber.js"
import denominate from "../../components/Denominate/denominate";
import { contractAddress } from "../../config";

const FEE_BASIS = new BigNumber(10000)
const BIG_ZERO = new BigNumber(0).precision(18)
const BIG_ONE = new BigNumber(1).precision(18)

const Home = () => {

  const [fee, setFee] = React.useState<BigNumber>(FEE_BASIS);
  const [liquidity, setLiquidity] = React.useState<BigNumber>(BIG_ZERO);
  const { address, dapp, explorerAddress } = Dapp.useContext();
  const percentAvailable = BIG_ONE.minus(fee.div(FEE_BASIS))
  const availableLiquidity = liquidity.multipliedBy(percentAvailable).dp(0).toFixed()

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
    const fetchLiquidity = async () => {
      let response = await contract.runQuery(dapp.proxy, {
        func: new ContractFunction("getLiquidityBalance"),
        args: []
      });

      let liquidity_bytes = Buffer.from(response.returnData[0], 'base64')
      let liquidity = new BigNumber('0x' + liquidity_bytes.toString("hex"))
      setLiquidity(liquidity.isPositive() ? liquidity : new BigNumber(0))
    }

    fetchFee()

    fetchLiquidity()
  }, [])

  return (
    <div className="d-flex flex-fill align-items-center container">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-5 mx-auto">
          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              <h2 className="mb-3" data-testid="title">
                <LKMexIcon className="token-icon-large" />LKMEX
              </h2>
              <h2>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon className="light-bg" icon={faCircle} />
                  <FontAwesomeIcon className="light-fg" icon={faArrowDown} />
                </span>
              </h2>
              <h2>
                <MexIcon className="token-icon-large" />MEX&nbsp;&nbsp;
              </h2>
              <p className="mb-3">
                Unlock your MEX. Unlock your future 😲
              </p>

              {/* TODO: other login methods

              <Link
                to={routeNames.unlock}
                className="btn btn-primary mt-3"
                data-testid="loginBtn"
              >
                Login
              </Link> */}

              <p className="mb-3">
                Connect to a wallet:
              </p>

              <Link
                className="btn btn-primary px-sm-4 m-1 mx-sm-3"
                to="walletconnect"
                data-testid="walletConnectLink"
              >
                Maiar App
              </Link>
            </div>
          </div>

          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              <h2 className="mb-3" data-testid="title">
                Available Liquidity
              </h2>
              <h4>{denominate({
                input: availableLiquidity?.toString() || '',
                denomination: 18,
                decimals: 0,
                showLastNonZeroDecimal: false
              })} <MexIcon className="token-icon-large" />MEX</h4>

              <h2 className="mb-3" data-testid="title">
                Unlock Fee
              </h2>
              <h3>{denominate({
                input: fee?.toString() || '',
                denomination: 2,
                decimals: 2,
                showLastNonZeroDecimal: true
              })}%</h3>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
