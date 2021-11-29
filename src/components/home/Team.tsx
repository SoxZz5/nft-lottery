import { createSvgIcon, Typography } from "@mui/material";
import * as React from "react";
import astronaut from "@/assets/images/team/astronaut.png";
import astronautSoxz from "@/assets/images/team/astronaut-soxz.png";

type TeamLink = {
  icon: any;
  viewbox: string;
  url: string;
};

type TeamMember = {
  name: string;
  alias: string;
  img: string;
  desc: string;
  links: TeamLink[];
};

const LinkedinIcon = createSvgIcon(
  <g>
    <path
      style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "white" }}
      d="M246.4,204.35v-0.665c-0.136,0.223-0.324,0.446-0.442,0.665H246.4z"
    />
    <path
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
      d="M0,0v455h455V0H0z M141.522,378.002H74.016V174.906h67.506V378.002z
		 M107.769,147.186h-0.446C84.678,147.186,70,131.585,70,112.085c0-19.928,15.107-35.087,38.211-35.087
		c23.109,0,37.31,15.159,37.752,35.087C145.963,131.585,131.32,147.186,107.769,147.186z M385,378.002h-67.524V269.345
		c0-27.291-9.756-45.92-34.195-45.92c-18.664,0-29.755,12.543-34.641,24.693c-1.776,4.34-2.24,10.373-2.24,16.459v113.426h-67.537
		c0,0,0.905-184.043,0-203.096H246.4v28.779c8.973-13.807,24.986-33.547,60.856-33.547c44.437,0,77.744,29.02,77.744,91.398V378.002
		z"
    />
  </g>,
  "linkedin"
);

const GithubIcon = createSvgIcon(
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />,
  "github"
);

const Team: React.FunctionComponent = () => {
  const teamMember: TeamMember[] = [
    {
      name: "Nicolas Cortella",
      alias: "KonyTech",
      img: astronaut,
      desc: `Experienced engineer transitioning from the video game industry to blockchain and fintech application development.
      Nicolas, with his strong backend skills,he realizes the smart contract of the lottery and the generation of dNFTs.
      After several years in the video game industry, he is now a blockchain developer`,
      links: [
        {
          icon: LinkedinIcon,
          viewbox: "0 0 455 455",
          url: "https://www.linkedin.com/in/nicolas-cortella/",
        },
        {
          icon: GithubIcon,
          viewbox: "0 0 16 16",
          url: "https://github.com/konytech",
        },
      ],
    },
    {
      name: "Lucas Giffard",
      alias: "SoxZz5",
      img: astronautSoxz,
      desc: `Web engineer, typescipt consultant, lead tech and front-end expert, 
      Lucas creates the front-end of the application and the smart contract in collaboration with Nicolas.
      With several years of experience in the web2.0 world, he is now looking to sharpen his skills in web3.0.`,
      links: [
        {
          icon: LinkedinIcon,
          viewbox: "0 0 455 455",
          url: "https://www.linkedin.com/in/giffardlucas/",
        },
        {
          icon: GithubIcon,
          viewbox: "0 0 16 16",
          url: "https://github.com/SoxZz5",
        },
      ],
    },
    {
      name: "Julien Leprou",
      alias: "Juicy",
      img: astronaut,
      desc: `Head of Design, talented UX/UI Designer, decentralized application designer.
After many years in the blockchain industry, Julien designs the application and the layers that make up the dNFTs.
He also accompanies the project in the realization of a whitepaper by bringing a glance on the future of the project.`,
      links: [
        {
          icon: LinkedinIcon,
          viewbox: "0 0 455 455",
          url: "https://www.linkedin.com/in/jleprou/",
        },
        {
          icon: GithubIcon,
          viewbox: "0 0 16 16",
          url: "https://github.com/JuicySeven",
        },
      ],
    },
  ];
  return (
    <div className="full-height team" id="team">
      <Typography
        variant={"h4"}
        component={"h2"}
        sx={{ ml: "4rem", mt: "6.5rem" }}
      >
        SPACE TEAM
      </Typography>
      <div className="team_content">
        {teamMember.map((member: TeamMember, index: number) => (
          <div className="team_content-card" key={index}>
            <Typography
              variant={"h4"}
              component={"h3"}
              sx={{
                textAlign: "center",
                mt: "2rem",
                mb: "2rem",
                fontWeight: "bold",
                textShadow: "0 2px 24px #36013f",
              }}
            >
              {member.alias}
            </Typography>
            <div className="team_content-avatar">
              <img src={member.img} />
            </div>
            <div className="team_content-description">
              <Typography
                variant={"subtitle1"}
                component={"h4"}
                sx={{
                  textAlign: "center",
                  mt: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {member.name}
              </Typography>
              <Typography
                variant={"subtitle1"}
                component={"p"}
                sx={{
                  textAlign: "center",
                  mt: "1rem",
                }}
              >
                {member.desc}
              </Typography>
            </div>
            <div className="team_content-links" style={{ marginTop: "2rem" }}>
              {member.links.map((link: TeamLink, index: number) => (
                <a
                  href={link.url}
                  target="_blank"
                  key={index}
                  style={{ marginLeft: index === 0 ? "0" : "2rem" }}
                >
                  <link.icon viewBox={link.viewbox} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
