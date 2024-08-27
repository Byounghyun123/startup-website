import React, { useState, useEffect, useContext } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from "next/router";
import axios from 'axios';

// INTERNAL IMPORT
import {
    NFTMarketplaceAddress,
    NFTMarketplaceABI
} from './constants';

//---FETCHING SMART CONTRACT (required for every web3 platform)
const fetchContract = (signerOrProvider)=>
    new ethers.Contract(
        NFTMarketplaceAddress,
        NFTMarketplaceABI,
        signerOrProvider
    );

//---CONNECTING WITH SMART CONTRACT (required for every web3 platform)
const connectingWithSmartContract = async() => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();

        const provider = new ethers.providers.Web3Provider(connection);
        // const provider = new ethers.BrowserProvider(connection);
        console.log(provider);

        const signer = provider.getSigner();
        console.log(signer);

        const contract = fetchContract(signer);
        console.log("This is the contract: ", contract);
        return contract;
    } catch (error) {
        console.log("Something went wrong while connecting with contract", error);
    }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
    const titleData = '0 TO LOSE';

    //-----USESTATE
    const [error, setError] = useState("");
    const [openError, setOpenError] = useState(false);
    const [currentAccount, setCurrentAccount] = useState("");
    const router = useRouter();

    //---CHECK IF WALLET IS CONNECTED (required for every web3 platform)
    const checkIfWalletConnected = async() => {
        try {
            if (!window.ethereum) return (
                setOpenError(true),
                setError("Install MetaMask"),
                console.log("Install MetaMask", error)
            );

            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });

            if(accounts.length){
                setCurrentAccount(accounts[0]);
                // const provider = new ethers.BrowserProvider(connection);
                // return accounts[0];
            } else {
                setError("No Account Found");
                setOpenError(true);
                console.log("No Account Found");
            }
            console.log("Current account wallet: ", currentAccount);
        } catch (error) {
            setError("Something went wrong while connecting to wallet");
            setOpenError(true);
            console.log("Something went wrong while connecting to wallet", error);
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    //---CONNECT WALLET FUNCTION (required for every web3 platform)
    const connectWallet = async() => {
        try {
            if (!window.ethereum) return (
                setOpenError(true),
                setError("Install MetaMask"),
                console.log("Install MetaMask")
            );

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            console.log("Showing accounts: ", accounts);
            setCurrentAccount(accounts[0]);
            // window.location.reload();
            connectingWithSmartContract();
        } catch (error) {
            setOpenError(true),
            setError("Error while connecting to wallet"),
            console.log("Error while connecting to wallet", error);
        }
    };

    //---UPLOAD TO IPFS FUNCTION
    const uploadToPinata = async (file) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `e9b0a6fb9f1b5f546ede`,
                        pinata_secret_api_key: `4dde8eee6cf79df504f49cdfdbc2d632c0e342f396afe49018821912643167ed`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

                return ImgHash;
            } catch (error) {
                setError("Unable to upload image to Pinata");
                setOpenError(true);
                console.log("Unable to upload image to Pinata", error);
            }
        }
        setError("File is missing, kindly provide your file");
        setOpenError(true);
        console.log("File is missing, kindly provide your file ");
    };

    //---CREATE NFT FUNCTION
    const createNFT = async(name, price, image, description, router) => {
        if(!name || !description || !price || !image) return (
            setOpenError(true),
            setError("Data is missing"),
            console.log("Data is missing", error)
        );

        const data = JSON.stringify({ name, description, image });

        try {
            const response = await axios({
                method: "POST",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    pinata_api_key: `e9b0a6fb9f1b5f546ede`,
                    pinata_secret_api_key: `4dde8eee6cf79df504f49cdfdbc2d632c0e342f396afe49018821912643167ed`,
                    "Content-Type": "application/json",
                },
            });

            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log("URL: ", url);

            await createSale(url, price);
            router.push('/searchPage');
        } catch (error) {
            setError("Error while creating NFT");
            setOpenError(true);
            console.log("Error while creating NFT", error);
        }
    };

    //----createSale FUNCTION
    const createSale = async(url, formInputPrice, isReselling, id) => {
        try {
            // const price = ethers.parseUnits(formInputPrice, 'ether');
            const price = ethers.utils.parseUnits(formInputPrice, "ether");
            // console.log(price);
            const contract = await connectingWithSmartContract();
            // console.log(contract);

            const listingPrice = await contract.getListingPrice();

            const transaction = !isReselling
                ? await contract.createToken(url, price, {
                    value: listingPrice.toString(),
                    })
                : await contract.resellToken(id, price, {
                    value: listingPrice.toString(),
                    });

            await transaction.wait();
            console.log("Transaction: ", transaction);
        } catch (error) {
            setError("Error while creating sale");
            setOpenError(true);
            console.log("error while creating sale", error);
        }
    };

    //--FETCH NFTs FUNCTION
    const fetchNFTs = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            // const provider = new ethers.BrowserProvider(connection);

            const contract = fetchContract(provider);

            const data = await contract.fetchMarketItem();

            // console.log(data);

            const items = await Promise.all(
                data.map(async({ tokenId, seller, owner, price: unformattedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);

                    const {
                        data: { image, name, description }
                    } = await axios.get(tokenURI, {});
                    const price = ethers.utils.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    );

                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI
                    };
                })
            );
            console.log("Showing NFT: ", items);
            return items;
        } catch (error) {
            setError("Error while fetching NFTs");
            setOpenError(true);
            console.log("Error while fetching NFTS", error);
        }
    };

    useEffect(() => {
        fetchNFTs();
    }, []);

    //--FETCHING MY NFT OR LISTED NFTs
    const fetchMyNFTsOrListedNFTs = async(type) => {
        try {
            const contract = await connectingWithSmartContract();

            const data = 
                type == "fetchItemsListed"
                    ? await contract.fetchItemsListed()
                    : await contract.fetchMyNFT();
            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {
                        data: {image, name, description}
                    } = await axios.get(tokenURI);
                    const price = ethers.utils.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    );

                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI
                    };
                })
            );
            return items;
        } catch (error) {
            setError("Error while fetching listed NFTs");
            setOpenError(true);
            console.log("Error while fetching listed NFTs", error);
        }
    };

    useEffect(() => {
      fetchMyNFTsOrListedNFTs();
    }, []);
    

    //---BUY NFTs FUNCTION
    const buyNFT = async(nft) => {
        try {
            const contract = await connectingWithSmartContract();
            const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

            const transaction = await contract.createMarketSale(nft.tokenId, {
                value: price,
            });

            await transaction.wait();
            router.push('/author');
        } catch (error) {
            setError("Error while buyding NFT");
            setOpenError(true);
            console.error("Error while buying NFT", error);
        }
    };

    return (
        <NFTMarketplaceContext.Provider
            value={{
                checkIfWalletConnected,
                connectWallet,
                uploadToPinata,
                createNFT,
                createSale,
                fetchNFTs,
                fetchMyNFTsOrListedNFTs,
                buyNFT,
                currentAccount,
                titleData,
                setOpenError,
                openError,
                error,
            }}
        >
            {children}
        </NFTMarketplaceContext.Provider>
    );
};