import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageState from "../../components/PageState";
import { contractAddress } from "../../config";
import { useContext, useDispatch } from "../../context";
import Actions from "./Actions";
import Farm from "./Farm";
import { getNftBalance, getTransaction, getTransactions, getTokenBalance } from "./helpers/asyncRequests";
import Transactions from "./Transactions";
import { ErrorBoundaryIgnored } from "../../components/ErrorBoundaryIgnored";

const Dashboard = () => {
  const ref = React.useRef(null);
  const { apiAddress, address } = Dapp.useContext();
  const { transactionsFetched } = useContext();
  const dispatch = useDispatch();

  const fetchData = () => {
    getTransactions({
      apiAddress,
      address,
      timeout: 3000,
      contractAddress,
    }).then(({ data, success }) => {
      dispatch({
        type: "setTransactions",
        transactions: data,
        transactionsFetched: undefined,
      });
      if (success && data?.length > 0) {
        for (const t of data) {
          getTransaction({
            apiAddress,
            address,
            contractAddress,
            timeout: 3000,
            txHash: t.txHash,
          }).then(({ data, success }) => {
            dispatch({
              type: "setTransactionOperations",
              operations: data?.operations,
              txHash: data?.txHash,
              transactionsFetched: success,
            });
          });
        }
      }
    });

    getNftBalance({
      apiAddress,
      address,
      timeout: 3000
    }).then(({ data, success }) => {
      dispatch({
        type: "setNftBalance",
        nftBalance: data
      });
    });

    getTokenBalance({
      apiAddress,
      address,
      timeout: 3000
    }).then(({ data, success }) => {
      dispatch({
        type: "setTokenBalance",
        tokenBalance: data
      });
    });





  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchData, []);

  if (transactionsFetched === undefined) {
    return <PageState svgComponent={<></>} spin />;
  }

  if (transactionsFetched === false) {
    return (
      <PageState
        svgComponent={
          <FontAwesomeIcon icon={faBan} className="text-secondary fa-3x" />
        }
        title="Unavailable"
        className="dapp-icon icon-medium"
      />
    );
  }

  return (
    <div className="container py-4" ref={ref}>

      <div className="row">
        <div className="col-12 col-md-10 mx-auto">
          <div className="card shadow-sm rounded border-0">
            <div className="card-body p-1">
              <div className="card rounded border-0">
                <div className="card-body text-center p-4">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button className="nav-link active" id="unlock-tab" data-bs-toggle="tab" data-bs-target="#unlock-mex-tab" type="button" role="tab" aria-controls="unlock-mex-tab" aria-selected="true">Unlock MEX</button>

                    </li>
                    <li className="nav-item">
                      <button className="nav-link d-inline position-relative" id="lock-tab" data-bs-toggle="tab" data-bs-target="#lock-mex-tab" type="button"
                        role="tab" aria-controls="lock-mex-tab" aria-selected="false">Lock MEX
                        <span className="ms-1 badge rounded-pill bg-success align-text-top position-absolute top-0 start-100">Beta</span>
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="unlock-mex-tab" role="tabpanel" aria-labelledby="unlock-tab"><Actions /></div>
                    <div className="tab-pane fade" id="lock-mex-tab" role="tabpanel" aria-labelledby="lock-tab"><Farm /></div>
                  </div>


                </div>
              </div>
              <ErrorBoundaryIgnored>
                <Transactions />
              </ErrorBoundaryIgnored>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
