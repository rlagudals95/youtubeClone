const express = require("express");
const router = express.Router();
// const { Video } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //어디에 파일을 저장할지 설정 // uploads폴더를 만들어준다
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // 저장할 파일이름 을 정해준다 20200616_filename
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      // 다른 포멧도 필요하면 || 이용해 추가
      return cb(
        res.status(400).end("jpg, png, mp4 파일만 업로드 가능합니다"),
        false
      );
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

// index.js에서 app.use("/api/video", require("./routes/video")); 해줘서 /uploadfiles만 써도된다

router.post("/uploadfiles", (req, res) => {
  //req로 파일을 받아오고 비디오를 서버에 저장!
  // 파일을 저장하기 위해 multer 모듈 다운로드
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    //성공시 파일을 업로드하면 uploads 폴더안에 들어간다 그 경로를 클라이언트에 보내준다
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
