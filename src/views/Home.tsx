import React from "react";
import Landing from "../components/home/Landing";
import Hangar from "../components/home/Hangar";
import Roadmap from "../components/home/Roadmap";
import Team from "../components/home/Team";
import Minter from "../components/minter/Minter";

const Home: React.FunctionComponent = () => {
  return (
    <div>
      <Landing />
      <Minter />
      <Roadmap />
    </div>
  );
};

export default Home;
