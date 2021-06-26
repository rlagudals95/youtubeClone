import React, { useState, memo } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

// 댓글 하나하나 컴포넌트
function SingleComment(props) {
  const user = useSelector((state) => state.user.userData);

  const videoId = props.postId;
  const [OpenReply, setOpenReply] = useState(false);

  const [CommentValue, setCommentValue] = useState();
  const onClickReplyOpen = () => {
    // 이렇게 하면 함수 하나로 토글 효과를 만들 수 있다
    // ! 는 피연산자를 true & false로 바꿀 수 있다
    setOpenReply(!OpenReply);
  };

  const onHandleChange = (e) => {
    setCommentValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user._id,
      postId: videoId,
      responseTo: props.comment._id,
    };

    axios.post("/api/comment/saveComment", variables).then((res) => {
      //   console.log(res);
      if (res.data.success) {
        //   console.log(res.data.result);
        setCommentValue("");
        props.refresh(res.data.result);
      } else {
        alert("댓글 작성에 실패했습니다 😂");
      }
    });
  };

  const actions = [
    //antd 라이브러리 속성에 Comment 부분은 이렇게 만들어 줘야하는 것 같다
    //Reply to 버튼이 생기고 대댓글 작성 form 토글 버튼역할
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />} // 유저 이미지
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="댓글을 작성해 주세요😀"
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default memo(SingleComment);
