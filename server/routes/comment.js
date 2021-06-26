const express = require("express");
const router = express.Router();

const { Comment } = require("../models/Comment");

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body); // 클라이언트 정보들을 여기 넣는다

  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    // populate('writer')해서 작성자 정보를 가져올 수 있지만 save해버린 경우엔 사용이 불가능하다 대신
    Comment.find({ _id: comment._id }) // comment id를 이용해 찾아온다
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

// 모든 댓글 보내주기
router.post("/getComment", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    // postId 로 찾은 댓글과 populate로 작성자의 정보 까지 모두 보내준다?
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
