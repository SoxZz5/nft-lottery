import Landing from "../components/home/Landing";
import Hangar from "../components/home/Hangar";
import Roadmap from "../components/home/Roadmap";
import Minter from "../components/minter/Minter";
import React from "react";

const Home: React.FunctionComponent = () => {
  return (
    <div>
      <Landing />
      <Minter />
      <Hangar />
      <Roadmap />
    </div>
  );
};

export default Home;
