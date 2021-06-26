import React, { useEffect, useState } from "react";
import axios from "axios";
function Subscriber(props) {
  const userTo = props.userTo;
  const userFrom = props.userFrom;
  const token = localStorage.getItem("userId");

  // console.log(userTo);
  // console.log(userFrom);
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  const onSubscribe = () => {
    let subscribeVariables = {
      userTo: userTo,
      userFrom: userFrom,
    };

    if (Subscribed) {
      //이미 구독중
      axios
        .post("/api/subscribe/unSubscribe", subscribeVariables)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소 하는데 실패 했습니다😅");
          }
        });
    } else {
      //구독중이 아닐때

      axios
        .post("/api/subscribe/subscribe", subscribeVariables)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 하는데 실패 했습니다😅");
          }
        });
    }
  };

  useEffect(() => {
    const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom };
    axios
      .post("/api/subscribe/subscribeNumber", subscribeNumberVariables)
      .then((response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert("구독수를 가져오는데 실패 했습니다😅");
        }
      });
    console.log(userTo);
    console.log(userFrom);
    axios
      .post("/api/subscribe/subscribed", subscribeNumberVariables)
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subcribed);
        } else {
          alert("구독정보를 가져오는데 실패 했습니다😅");
        }
      });
  }, []);

  return (
    <div>
      {token ? ( // 로그인한 유저만 구독 버튼이 보인다
        <button
          onClick={onSubscribe}
          style={{
            backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
            borderRadius: "4px",
            color: "white",
            padding: "10px 16px",
            fontWeight: "500",
            fontSize: "1rem",
            textTransform: "uppercase",
            border: "none",
          }}
        >
          {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
        </button>
      ) : null}
    </div>
  );
}

export default Subscriber;
