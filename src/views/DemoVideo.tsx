import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const DemoVideo: React.FunctionComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    var link = document.createElement("a");
    link.href = "https://www.youtube.com/channel/UCnE8XiKIeyJ2sPmViDcELsw";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    navigate("/");
  }, []);
  return <div></div>;
};

export default DemoVideo;
