import React from "react";
import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Typography, Row, Col, Avatar, Card, Icon } from "antd";
import moment from "moment";
import axios from "axios";
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Videos, setVideos] = useState([]); //

  useEffect(() => {
    // 접속자의 구독정보를 가져오기 위해서 로컬 스토리지에서 userId를 서버로 넘겨줘야한다
    let subscriptionOption = { userFrom: localStorage.getItem("userId") };

    console.log(subscriptionOption);
    axios
      .post("/api/video/getSubscriptionVideos", subscriptionOption)
      .then((res) => {
        if (res.data.success) {
          console.log("구독한 것들", res.data);
          setVideos(res.data.videos);
        } else {
          alert("비디오 불러오기 실패😅");
        }
      });
  }, []);

  const renderCards = Videos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60); // 60으로 나누면 분이된다
    let seconds = Math.floor(video.duration - minutes * 60); // 분을 지우고 60곱하면 초가 된다

    return (
      <Col lg={6} md={8} xs={24}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes}: {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span></span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span>-
        <span>{moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  return (
    <>
      <div style={{ width: "85%", margin: "3rem auto" }}>
        <Title level={2}>추천 VIDEOS</Title>
        <hr />
        {/* Row와 Col은 1개의 Row에 4개의 비디오(Col)를 넣고 싶다 */}
        <Row gutter={[32, 16]}>{renderCards}</Row>
        {/* //xs가장 작을때 비디오 하나 크기가 24가 된다 중간은 8 제일클때 6 // 반응형 6곱하기 4는 24 게시물4개 */}
      </div>
    </>
  );
}

export default SubscriptionPage;
