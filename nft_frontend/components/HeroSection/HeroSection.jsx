import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// INTERNAL IMPORT
import Style from './HeroSection.module.css';
import { Button } from '../componentsindex';
import images from '../../img';

// IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext';

const HeroSection = () => {
    const {titleData} = useContext(NFTMarketplaceContext);
    const router = useRouter();

    return (
        <div className={Style.heroSection}>
            <div className={Style.heroSection_box}>
                <div className={Style.heroSection_box_left}>
                    <h1>{titleData}</h1>
                    <p>
                        Discover the most outstanding NFTs in all topics of life. Creative
                        your NTFs and sell them
                    </p>
                    <Button btnName='Start your search' handleClick={() => router.push('/searchPage')}/>
                </div>
                <div className={Style.heroSection_box_right}>
                    <Image
                        src={images.kevin}
                        alt='Hero section'
                        layout='responsive'
                        width={600}
                        height={600}
                    />
                </div>
            </div>
        </div>
    )
};

export default HeroSection;