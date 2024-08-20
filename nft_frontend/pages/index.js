import React, { useEffect, useState, useContext } from "react";

// INTERNAL IMPORT
import Style from '../styles/index.module.css';
import {
  HeroSection,
  Service,
  BigNFTSlider,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  AudioLive,
  FollowerTab,
  Slider,
  Brand,
  Video,
  Loader
} from '../components/componentsindex';

// IMPORTING CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const { checkIfWalletConnected, currentAccount } = useContext(NFTMarketplaceContext);
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const {fetchNFTs} = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs().then((items) => {
        console.log(nfts);
        setNfts(items?.reverse());
        setNftsCopy(items);
       });
    }
  }, [currentAccount]);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
      <Title
        heading='Latest Audio Collection'
        paragraph='Discover the most outstanding NFTs in all topics of life.'
      />
      <AudioLive />
      <FollowerTab />
      <Slider />
      <Collection />
      <Title
        heading='Featured NFTs'
        paragraph='Discover the most outstanding NFTs in all topics of life.'
      />
      <Filter />
      {nfts.length == 0 ? <Loader/> : <NFTCard NFTData={nfts}/> }
      <Title
        heading='Browse by category'
        paragraph='Explore the NFTs in the most featured categories.'
      />
      <Category />
      <Subscribe />
      <Brand />
      <Video />
    </div>
  );
};

export default Home;
