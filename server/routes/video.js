const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
//썸네일 가져오기 위해!
let ffmpeg = require("fluent-ffmpeg");

var storage = multer.diskStorage({
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

// 이제 비디오를 업로드 할때 라우트 작성
router.post("/uploadVideo", (req, res) => {
  //비디오 정보들을 mongoDB에 저장한다
  const video = new Video(req.body); // 클라이언트에서 보낸 비디오정보

  video.save((err, doc) => {
    //mongoDB저장 메소드
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

//썸네일 생성

router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성 하고 비디오 러닝타임도 가져오기!

  ffmpeg(req.body.url) // 클라이언트에서 보내준 비디오 저장경로! upload폴더
    .on("filenames", function (filenames) {
      // 파일네임 생성
      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      return res.json({
        // 썸네일이 다 생성되면
        success: true,
        url: filePath, // 섬네일 저장경로
        fileDuration: fileDuration, //비디오 러닝타임
      });
    })
    .on("error", function (err) {
      // 에러가 난다면?
      return res.json({ success: false, err });
    })
    .screenshots({
      // 여긴 옵션이 들어감 카운트의 갯수는 썸네일의 갯수
      count: 1,
      folder: "uploads/thumbnails", // 업로드 폴더안에 썸네일 폴더안에 썸네일이 저장된다
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
