import React from "react";
//css 라이브러리 antd
import { Typography, Button, Form, message, Input, Icon } from "antd";
// 드래그 앤 드랍 라이브러리
import Dropzone from "react-dropzone";

const { Title } = Typography;
const { TextArea } = Input;

const VideoUploadPage = () => {
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드래그앤 드랍존 */}
          <Dropzone onDrop multiple maxSize>
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
        <Input onChange value />
        <br />
        <br />
        <label htmlFor="">description</label>
        <Input onChange value />
        <br />
        <br />
        <select>
          <option key value></option>
        </select>
        <br />
        <br />
        <select>
          <option key value></option>
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
