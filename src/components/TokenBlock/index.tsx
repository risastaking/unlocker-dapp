import { DenominateType } from '../../components/Denominate/denominate';
import { getToken } from '../../pages/Dashboard/helpers/asyncRequests';
import * as React from 'react';
import * as Dapp from "@elrondnetwork/dapp";
import Denominate from '../../components/Denominate';
import NetworkLink from '../../components/NetworkLink';
import { urlBuilder } from '../../helpers';

interface TokenType {
    assets: {
      description:  string;
      pngUrl:  string;
      status:  string;
      svgUrl:  string;
      website: string;
    }
    balance:  string;
    burnt:  string;
    canBurn: boolean;
    canChangeOwner: boolean;
    canFreeze: boolean;
    canMint: boolean;
    canPause: boolean;
    canUpgrade: boolean;
    canWipe: boolean;
    decimals: number;
    identifier:  string;
    isPaused: boolean;
    minted:  string;
    name:  string;
    owner:  string;
    ticker:  string;
}

interface TokenBlockType extends DenominateType {
  identifier: string;
}

const TokenBlock = (props: TokenBlockType) => {

  const { apiAddress } = Dapp.useContext();
  const ref = React.useRef(null);
  const [tokenDetails, setTokenBlock] = React.useState<TokenType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenBlock = () => {
    getToken({
      apiAddress,
      timeout: 3000,
      identifier: props.identifier
    }).then(({ success, data }) => {
      if (ref.current !== null) {
        setTokenBlock(data);
        setDataReady(success);
      }
    });
  };

  const denomination =
    dataReady === true && tokenDetails && tokenDetails.decimals
      ? tokenDetails.decimals
      : 18;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTokenBlock, [props.identifier]);
  return (
    <div ref={ref} className="d-flex">
      {props.value && (
        <div className="mr-1">
          <Denominate {...props} denomination={denomination} showLabel={false} />
        </div>
      )}
      <NetworkLink
        to={urlBuilder.tokenDetails(props.identifier)}
        className={`d-flex ${tokenDetails?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol">
          {dataReady === undefined && <span>{props.identifier}</span>}
          {dataReady === false && <span className="text-truncate">{props.identifier}</span>}
          {dataReady === true && tokenDetails && (
            <>
              {tokenDetails.assets ? (
                <>
                  {tokenDetails.assets.svgUrl && (
                    <img
                      src={tokenDetails.assets.svgUrl}
                      alt={tokenDetails.name}
                      className="token-icon mx-1"
                    />
                  )}
                  <div>{tokenDetails.name}</div>
                </>
              ) : (
                <span className="text-truncate">{props.identifier}</span>
              )}
            </>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};

export default TokenBlock;
