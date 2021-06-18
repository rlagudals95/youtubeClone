import React, { useEffect, useState } from "react";
import axios from "axios";

function SideVideo() {
  const [sideVideo, setsideVideo] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setsideVideo(res.data.videos);
      } else {
        alert("비디오 불러오기 실패😅");
      }
    });
  }, []);

  const renderSideVideo = sideVideo.map((video, index) => {
    let minutes = Math.floor(video.duration / 60); // 60으로 나누면 분이된다
    let seconds = Math.floor(video.duration - minutes * 60); // 분을 지우고 60곱하면 초가 된다
    return (
      <div key={index} style={{ display: "flex", marginBottom: "1rem" }}>
        <div style={{ width: "40%", marginRight: "1rem" }}>
          <a href="">
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumnail"
            />
          </a>
        </div>
        <div style={{ width: "50%" }}>
          <a href="" style={{ color: "grey" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views}views</span>
            <br />
            <span>
              {minutes}:{seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ marginTop: "3rem" }}>
        <React.Fragment>{renderSideVideo}</React.Fragment>
      </div>
    </>
  );
}

export default SideVideo;
