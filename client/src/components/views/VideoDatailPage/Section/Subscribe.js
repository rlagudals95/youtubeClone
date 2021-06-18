import React, { useEffect } from "react";
import axios from "axios";
function Subscribe(props) {
  useEffect(() => {
    let variable = { userTo: props.userTo };
    axios.get("/api/Subscribe/SubscribeNumber", variable).then((res) => {
      if (res.success) {
      } else {
        alert("Subscribe가져오기 오류😅");
      }
    }, []);
  });

  return (
    <div>
      <button
        style={{
          backgroundColor: "#CC0000",
          borderRadius: "4px",
          border: "none",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick
      >
        0 Subscribe
      </button>
    </div>
  );
}

export default Subscribe;
