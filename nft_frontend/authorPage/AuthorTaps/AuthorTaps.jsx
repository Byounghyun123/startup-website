import React, { useState } from 'react';
import Image from 'next/image';
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from 'react-icons/ti';

// INTERNAL IMPORT
import Style from './AuthorTaps.module.css';


const AuthorTaps = ({ setCollectibles, setCreated, setLike, setFollower, setFollowing }) => {
  const [openList, setOpenList] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState('Most Recent');

  const listArray = [
    'Most Recent',
    "Created By Admin",
    "Most Appreciated",
    "Most Discussed",
    "Most Viewed"
  ];

  const openDropDownList = () => {
    if(!openList) {
      setOpenList(true);
    } else {
      setOpenList(false);
    }
  };

  const openTab = (e) => {
    const btnText = e.target.innerText;
    if(btnText == "Listed NFTs") {
      setCollectibles(true);
      setCreated(false);
      setFollower(false);
      setFollowing(false);
      setLike(false);
      setActiveBtn(1);
    } else if (btnText == "NFTs you own") {
      setCollectibles(false);
      setCreated(true);
      setFollower(false);
      setFollowing(false);
      setLike(false);
      setActiveBtn(2);
    } else if (btnText == "Liked") {
      setCollectibles(false);
      setCreated(false);
      setFollower(false);
      setFollowing(false);
      setLike(true);
      setActiveBtn(3);
    } else if (btnText == "Following") {
      setCollectibles(false);
      setCreated(false);
      setFollower(false);
      setFollowing(true);
      setLike(false);
      setActiveBtn(4);
    } else if (btnText == "Followers") {
      setCollectibles(false);
      setCreated(false);
      setFollower(true);
      setFollowing(false);
      setLike(false);
      setActiveBtn(5);
    }
  };

  return (
    <div className={Style.AuthorTaps}>
      <div className={Style.AuthorTaps_box}>
        <div className={Style.AuthorTaps_box_left}>
          <div className={Style.AuthorTaps_box_left_btn}>
            <button
              onClick={(e) => openTab(e)}
              className={`${activeBtn == 1 ? Style.active : ""}`}
            >
              Listed NFTs
            </button>
            <button
              onClick={(e) => openTab(e)}
              className={`${activeBtn == 2 ? Style.active : ""}`}
            >
              NFTs you own{""}
            </button>
            <button
              onClick={(e) => openTab(e)}
              className={`${activeBtn == 3 ? Style.active : ""}`}
            >
              Liked{""}
            </button>
            <button
              onClick={(e) => openTab(e)}
              className={`${activeBtn == 4 ? Style.active : ""}`}
            >
              Following{""}
            </button>
            <button
              onClick={(e) => openTab(e)}
              className={`${activeBtn == 5 ? Style.active : ""}`}
            >
              Followers{""}
            </button>
          </div>
        </div>

        <div className={Style.AuthorTaps_box_right}>
          <div
            className={Style.AuthorTaps_box_right_para}
            onClick={() => openDropDownList()}
          >
            <p>{selectedMenu}</p>
            {openList ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>

          {openList && (
            <div className={Style.AuthorTaps_box_right_list}>
              {listArray.map((el,i)=> (
                <div
                  key={i + 1}
                  onClick={() => setSelectedMenu(el)}
                  className={Style.AuthorTaps_box_right_list_item}
                >
                  <p>{el}</p>
                  <span>{selectedMenu == el && <TiTick />}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default AuthorTaps;