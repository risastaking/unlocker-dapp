import Denominate from '../../components/Denominate';
import * as Dapp from "@elrondnetwork/dapp";
import * as React from 'react';
import { urlBuilder } from '../../helpers';
import { getNft } from '../../pages/Dashboard/helpers/asyncRequests';
import NetworkLink from '../../components/NetworkLink';
interface NftBlockType {
  identifier: string;
  collection: string;
  value?: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string | React.ReactNode;
  decimals?: number;
  denomination?: number;
  'data-testid'?: string;
}
export interface NftType {
  identifier: string;
  collection: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  name: string ;
  creator: string;
  royalties?: number;
  uris: string[];
  url: string;
  thumbnailUrl: string;
  tags: string[];
  owner?: string;
  balance?: string;
  supply?: string;
  decimals: number | undefined;
  assets?: {
    svgUrl: string;
  }
  ticker: string;
}
export interface TokenType {
  identifier: string;
  name: string ;
  ticker: string;
  owner?: string;
  minted:string;
  burnt: string;
  decimals: number | undefined;
  isPaused: boolean;
  assets?: {
    svgUrl: string;
  }
  balance?: string;
}

const NftBlock = (props: NftBlockType) => {

  const { apiAddress } = Dapp.useContext();
  const ref = React.useRef(null);
  const [nftDetails, setNftDetails] = React.useState<NftType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchNftBlock = () => {
    getNft({
      apiAddress,
      timeout: 3000,
      identifier: props.identifier
    }).then((nftData) => {
      if (ref.current !== null) {
        if (nftData.success) {
          setNftDetails(nftData.data);
        }
        setDataReady(nftData.success);
      }
    });
  };

  const denomination =
    dataReady === true && nftDetails && nftDetails.decimals ? nftDetails.decimals : 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftBlock, [props.identifier]);

  return (
    <div ref={ref} className="d-flex">
      {props.value && (
        <div className="mr-1">
          <Denominate
            {...props}
            value={props.value}
            showLabel={false}
            denomination={denomination}
          />
        </div>
      )}
      <NetworkLink
        to={urlBuilder.nftDetails(props.identifier)}
        className={`d-flex ${nftDetails?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol">
          {dataReady === undefined && <span>{props.identifier}</span>}
          {dataReady === false && <span className="text-truncate">{props.identifier}</span>}
          {dataReady === true && nftDetails && (
            <>
              {nftDetails.assets ? (
                <>
                  {nftDetails.assets.svgUrl && (
                    <img
                      src={nftDetails.assets.svgUrl}
                      alt={nftDetails.name}
                      className="token-icon mr-1"
                    />
                  )}
                  <div>
                    {nftDetails.name} ({nftDetails.identifier})
                  </div>
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

export default NftBlock;
