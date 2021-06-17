import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./views/VideoDatailPage/VideoDetailPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          {/* null은 아무나 이 페이지에 들어갈 수 있음 */}
          <Route exact path="/" component={Auth(LandingPage, null)} />
          {/* false는 로그인한 사람은 접속불가 */}
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          {/* true는 로그인한 사람만 접근가능 */}
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/video/upload"
            component={Auth(VideoUploadPage, true)}
          />
          <Route
            exact
            path="/video/:videoId"
            component={Auth(VideoDetailPage, null)}
          />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
