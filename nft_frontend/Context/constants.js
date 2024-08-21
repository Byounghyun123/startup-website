
import nftMarketplace from './NFTMarketplace.json';

//------LOCALHOST-------
export const NFTMarketplaceAddress = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';
export const NFTMarketplaceABI = nftMarketplace.abi;

//------NETWORK-------
const networks = {
    localhost: {
        chainId: `0x${Number(31337).toString(16)}`,
        chainName: "localhost",
        nativeCurrency: {
            name: "GO",
            symbol: "GO",
            decimals: 18,
        },
        rpcUrls: ["http://127.0.0.1:8545/"],
        blockExplorerUrls: ["https://bscscan.com"],
    }
};

const changeNetwork = async ({ networkName }) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    ...netwoks[networkName],
                },
            ],
        });
    } catch (err) {
        console.log(err.message);
    }
};

export const handleNetworkSwitch = async () => {
    const networkName = "localhost";
    await changeNetwork({ networkName });
};

