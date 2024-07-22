import React from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';

// INTERNAL IMPORT
import Style from './DaysComponents.module.css';
import images from '../../../img';

const DaysComponents = ({el, i}) => {
    return (
      <div className={Style.daysComponents}>
        <div className={Style.daysComponents_box}>
          <div className={Style.daysComponents_box_img}>
            <Image
              src={el.background}
              className={Style.daysComponents_box_img_img}
              alt="profile background"
              width={500}
              height={300}
              objectFit='covers'
              layout='fixed'
            />
          </div>
          <div className={Style.daysComponents_box_profile}>
            <Image
              src={images.creatorbackground2}
              alt='profile'
              width={200}
              height={200}
              className={Style.daysComponents_box_img_1}
              objectFit='covers'
              layout='responsive'
            />
            <Image
              src={images.creatorbackground2}
              alt='profile'
              width={200}
              height={200}
              className={Style.daysComponents_box_img_2}
              objectFit='covers'
              layout='responsive'
            />
            <Image
              src={images.creatorbackground2}
              alt='profile'
              width={200}
              height={200}
              className={Style.daysComponents_box_img_3}
              objectFit='covers'
              layout='responsive'
            />
          </div>

          <div className={Style.daysComponents_box_title}>
            <h2>Amazing Collection</h2>
            <div className={Style.daysComponents_box_title_info}>
              <div className={Style.daysComponents_box_title_info_profile}>
                <Image
                  src={el.user}
                  alt='profile'
                  width={30}
                  height={30}
                  objectFit='covers'
                  className={Style.daysComponents_box_title_info_profile_img}
                />

                <p>
                  Creator
                  <span>
                    Kevin Lee
                      <small>
                        <MdVerified />
                      </small>
                  </span>
                </p>
              </div>

              <div className={Style.daysComponents_box_title_info_price}>
                <small>1.255 ETH</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
};

export default DaysComponents;