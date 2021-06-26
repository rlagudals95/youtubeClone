import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";
import Comment from "./Section/Comment";

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState();
  const [Comments, setComments] = useState([]);
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };

  useEffect(() => {
    axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("비디오 정보를 가져올 수 없습니다😅");
      }

      // 모든 댓글 가져오기
      axios.post("/api/comment/getComment", variable).then((res) => {
        if (res.data.success) {
          console.log("댓글", res.data);
          setComments(res.data.comments);
        } else {
          alert("댓글을 가져오기 오류입니다 😅");
        }
      });
    });
  }, []); // VideoDetail가 들어오면 화면 재렌더링

  console.log("!!", Comments);
  const refresh = (newCommnets) => {
    // 상태 업그레이드 함수
    // Comments에 concat으로 새로운 배열을 넣어준다
    setComments(Comments.concat(newCommnets));
  };

  return (
    <React.Fragment>
      {VideoDetail && (
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
                actions={[
                  <Subscribe
                    userTo={VideoDetail.writer._id}
                    userFrom={localStorage.getItem("userId")}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={VideoDetail.writer.image} />}
                  title={VideoDetail.writer.name}
                  description={VideoDetail.description}
                />
              </List.Item>
              {/* comment */}
              <Comment
                refresh={refresh}
                commentLists={Comments}
                postId={videoId}
              />
            </div>
          </Col>
          <Col lg={6} xs={24}>
            <SideVideo />
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
}

export default VideoDetailPage;
