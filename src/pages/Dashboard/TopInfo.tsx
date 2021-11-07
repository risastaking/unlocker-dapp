import * as Dapp from "@elrondnetwork/dapp";
import { contractAddress, fromToken } from "../../config";
import { useContext } from "../../context";
import denominate from '../../components/Denominate/denominate';
import NftBlock from "../../components/NftBlock";

const TopInfo = () => {
  const {
    address,
    account: { balance }
  } = Dapp.useContext();

  const { nftBalance } = useContext();

  return (
    <div className="text-white" data-testid="topInfo">
      <div className="mb-1">
        <span className="opacity-6 mr-1">Your address:</span>
        <span data-testid="accountAddress"> {address}</span>
      </div>
      <div className="mb-4">
        <span className="opacity-6 mr-1">Contract address:</span>
        <span data-testid="contractAddress"> {contractAddress}</span>
      </div>
      <div>
        <h3 className="py-2">
        </h3>
        <select>
          {nftBalance?.filter(t => t.ticker === fromToken).map(t =>
            <option key={t.identifier} >
              {t.identifier} - {
                denominate({
                  input: t.balance,
                  denomination: t.decimals,
                  decimals: 2
                })}
            </option>)}
        </select>
      </div>
    </div>
  );
};

export default TopInfo;
