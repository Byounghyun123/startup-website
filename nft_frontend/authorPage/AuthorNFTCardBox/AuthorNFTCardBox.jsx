import React, { useState } from 'react';

// INTERNAL IMPORT
import Style from './AuthorNFTCardBox.module.css';
import images from '../../img';
import { NFTCardTwo } from '../../collectionPage/collectionIndex';
import FollowerTabCard from '../../components/FollowerTab/FollowerTabCard/FollowerTabCard';

const AuthorNFTCardBox = ({ collectibles, created, like, follower, following, nfts, myNFTs }) => {
  // const collectiblesArray = [
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1,
  //   images.nft_image_2
  // ];

  // const createdArray = [
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1
  // ];

  // const likeArray = [
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1,
  //   images.nft_image_2
  // ];

  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    }
  ];

  const followingArray = [
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    },
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "0xasdf74l2kha9df8y4kasdf649283"
    }
  ];

  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectibles && <NFTCardTwo NFTData={nfts} />}
      {created && <NFTCardTwo NFTData={myNFTs} />}
      {like && <NFTCardTwo NFTData={nfts} />}
      {follower && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followerArray.map((el, i) => (
            <FollowerTabCard i={i} el={el} />
          ))}
        </div>
      )}
      {following && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followingArray.map((el, i) => (
            <FollowerTabCard i={i} el={el} />
          ))}
        </div>
      )}
    </div>
  )
};

export default AuthorNFTCardBox;