import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState([]);
  useEffect(() => {
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId };

    axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        console.log(res);
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("비디오 정보를 가져올 수 없습니다😅");
      }
    });
  }, []); // VideoDetail가 들어오면 화면 재렌더링

  if (VideoDetail.writer) {
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div
            style={{
              width: "100%",
              padding: "3rem 4rem",
            }}
          >
            <video
              style={{ width: "100%" }}
              //  실제 동영상 파일경로 src로
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            <List.Item
              actions={[<Subscribe userTo={VideoDetail.writer._id} />]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
            {/* comment */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
