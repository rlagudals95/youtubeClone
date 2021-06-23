const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { Subscriber } = require("../models/Subscriber");

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

// 비디오들을 DB에서 가져와서 클라이언트로 보내주기
router.get("/getVideos", (req, res) => {
  Video.find()
    .populate("writer") // populate를 해줘야 비디오의 모든 정보를 가져올 수 있음
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

// 비디오 디테일 정보가져오기
router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId }) // 클라이언트 에서 보낸 비디오 id로 찾는다
    // 비디오의 모든 정보를 가져오기 위해서 populate를 써준다
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
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

// 구독한 동영상 데이터

router.post("/getSubscriptionVideos", (req, res) => {
  // 자신의 아이디를 가지고 구독하는 정보들을 찾는다
  // Subscriber 모델을 가져오고 받은 사용자 id로 찾는다
  Subscriber.find({ userFrom: req.body.userFrom }).exec((err, Subscribers) => {
    if (err) return res.status(400).send(err);

    let subscribedUser = []; // 클라이언트가 구독한 사람들을 담는 배열

    for (let i = 0; i < Subscribers.length; i++) {
      subscribedUser.push(Subscribers[i].userTo);
    }

    // Subscribers.map((subscriber, i) => {
    //   console.log(subscriber);
    //   subscribedUser.push(subscriber.userTo);
    // });

    //이제 구독한 사람들의 비디오를 가져와야한다
    //구독한 사람이 여러명일 수 있으므로 req.body.id 대신  { $in: subscribedUser }
    //구독한 모든 사람들의 id를 가지고 writer들을 찾는다
    Video.find({ writer: { $in: subscribedUser } })
      .populate("writer") //writer의 모든 정보를 가져온다
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });

  // 찾은 사람들의 비디오를 가지고 온다
});

module.exports = router;

// /`exec`는 데이터 대신 상태 정도의 작은 결과를 출력하는 프로그램을 실행하는 용도로 사용한다. 또 하나, `spawn`은 비동기로 실행하고, 결과도 비동기로 받는다. `exec`는 동기로 실행하고, 결과는 비동기로 받는다
// Population 이란??
//   Population는 문서의 경로를 다른 컬렉션의 실제 문서로 자동으로 바꾸는 방법입니다.
// 예를들어 문서 사용자 ID를 해당 사용자의 데이터로 바꿉니다.Mongoose는 우리를 도울 수있는 Population을 가지고 있습니다.우리는 우리의 스키마에 ref를 정의하고 mongoose는 해당 ref를 사용하여 다른 컬렉션의 문서를 찾습니다.
