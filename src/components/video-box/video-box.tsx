'use client'
import video_bg from '@/assets/img/bg/bg-video.webp';
import { useVideoModal } from "@/provider/VideoProvider";

const VideoBox = () => {
  const { playVideo } = useVideoModal();
  return (
    <>
      <div
        className="video__area-df"
        style={{ background: `url(${video_bg.src})` }}
      >
        <div className="container">
          <div className="video__content text-center">
            <div className="video__button mb-60">
              <button onClick={() => playVideo("a2g7Q8n9Li8")}>
                <i className="fas fa-play"></i>
              </button>
            </div>
            <h5 className="video__title">AWESOME VIDEO LIGHTBOX </h5>
            <p>
              Investigationes demonstraverunt lectores legere me lius quod ii
              legunt saepius.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoBox;
