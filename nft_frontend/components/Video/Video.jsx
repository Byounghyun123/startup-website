import React from 'react';
import Image from 'next/image';

// INTERNAL IMPORT
import Style from './Video.module.css';
import images from '../../img';

const Video = () => {
  return (
    <div className={Style.Video}>
        <div className={Style.Video_box}>
            <h1>
                <span>🎬</span> The Videos
            </h1>
            <p>
            Check out our hottest videos. View more and share more new
            perspectives on just about any topic. Everyone's welcome.
            </p>

            <div className={Style.Video_box_frame}>
                <div className={Style.Video_box_frame_left}>
                    <Image
                        className={Style.Video_box_frame_left_img}
                        src={images.NFTVideo}
                        alt='Video image'
                        width={1920}
                        height={1080}
                        objectFit='cover'
                        layout='responsive'
                    />
                </div>

                <div className={Style.Video_box_frame_right}>Hey</div>
            </div>
        </div>
    </div>
  )
};

export default Video;