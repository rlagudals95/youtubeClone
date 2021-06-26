import React, { useState, memo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";

function Comment(props) {
  const [commentValue, setCommentValue] = useState();

  const user = useSelector((state) => state.user.userData);
  console.log(user);
  const handleClick = (e) => {
    setCommentValue(e.target.value);
  };

  const videoId = props.postId;

  const onSubmit = (e) => {
    e.preventDefault();
    const variables = {
      content: commentValue,
      writer: user._id,
      postId: videoId,
    };
    setCommentValue("");

    // console.log('보내는 내용',variables);
    axios.post("/api/comment/saveComment", variables).then((res) => {
      console.log(res);
      if (res.data.success) {
        console.log("댓글저장", res.data);
        props.refresh(res.data.result); // 댓글 저장 성공한다면 상태 업그레이드 작성한 댓글을 부모 상태에 합쳐준다
      } else {
        alert("댓글 작성에 실패했습니다 😂");
      }
    });
  };

  return (
    <div>
      <br />
      <p>replies</p>
      <hr />

      {/* 댓글 리스트 */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, idx) =>
            !comment.reponseTo && (
              <SingleComment
                refresh={props.refresh}
                comment={comment}
                postId={videoId}
              />
            )
        )}

      {/* 댓글 작성 form */}
      <form style={{ display: "flex" }}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="댓글을 작성해 주세요😀"
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default memo(Comment);
