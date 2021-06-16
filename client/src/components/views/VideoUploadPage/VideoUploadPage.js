import React, { useState } from "react";
//css 라이브러리 antd
import { Typography, Button, Form, message, Input, Icon } from "antd";
// 드래그 앤 드랍 라이브러리
import Dropzone from "react-dropzone";
import Axios from "axios";
import { is } from "bluebird";

const { Title } = Typography;
const { TextArea } = Input;

// 위에서 배열로감싼 객체들은 map으로 돌린다..!
const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

const VideoUploadPage = () => {
  const [VideoTitie, setVideoTitie] = useState("");
  const [Desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");

  const onTitleChange = (e) => {
    setVideoTitie(e.currentTarget.value);
  };

  const onDescriptChange = (e) => {
    setDesc(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivacy(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  //드래그로 파일 업로드 하기
  //폼데이터로 보내기
  const onDrop = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploadfiles", formData, config).then((res) => {
      if (res.data.success) {
        console.log(res.data);
      } else {
        window.alert("비디오 업로드에 실패했습니다 😯");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드래그앤 드랍존 */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {/* 썸네일 */}
          <div>
            <img src="" alt="" />
          </div>
        </div>
        <br />
        <br />
        <label>Title </label>
        <Input onChange={onTitleChange} value={VideoTitie} />
        <br />
        <br />
        <label htmlFor="">description</label>
        <TextArea onChange={onDescriptChange} value={Desc} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {Private.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick>
          submit
        </Button>
      </Form>
    </div>
  );
};

export default VideoUploadPage;
